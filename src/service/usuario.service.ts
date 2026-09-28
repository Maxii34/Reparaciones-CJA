import bcrypt from "bcryptjs"; // si instalaste bcryptjs en este proyecto, cambiá el import
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { usuarioRepository } from "../repositores/usuario.repository";
import { refreshTokenRepository } from "../repositores/refreshToken.repository";
import { RolUsuario } from "../generated/prisma/client";
import { NotFoundError, ConflictError, UnauthorizedError } from "../utils/errors";

export interface CrearUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rol?: RolUsuario;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ActualizarUsuarioDTO {
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
  activo?: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_DIAS = 7;

const generarAccessToken = (usuario: { id: number; rol: RolUsuario }) =>
  jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions
  );

const generarRefreshToken = async (usuarioId: number) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiraEn = new Date(Date.now() + REFRESH_TOKEN_DIAS * 24 * 60 * 60 * 1000);
  await refreshTokenRepository.create(usuarioId, token, expiraEn);
  return token;
};

export const usuarioService = {
  getAll: () => usuarioRepository.findAll(),

  getById: async (id: number) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return usuario;
  },

  create: async (data: CrearUsuarioDTO) => {
    const existente = await usuarioRepository.findByEmail(data.email);
    if (existente) {
      throw new ConflictError("Ya existe un usuario con ese email");
    }

    if (data.rol === "ADMIN") {
      const admins = await usuarioRepository.findByRol("ADMIN");
      if (admins.length >= 1) {
        throw new ConflictError("Ya existe un administrador en el sistema");
      }
    }

    const passwordHasheada = await bcrypt.hash(data.password, 10);

    const usuario = await usuarioRepository.create({
      nombre: data.nombre,
      email: data.email,
      passwordHash: passwordHasheada,
      rol: data.rol ?? "TECNICO",
    });

    const { passwordHash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  },

  login: async (data: LoginDTO) => {
    const usuario = await usuarioRepository.findByEmail(data.email);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const passwordValida = await bcrypt.compare(data.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const accessToken = generarAccessToken(usuario);
    const refreshToken = await generarRefreshToken(usuario.id);

    const { passwordHash, ...usuarioSinPassword } = usuario;
    return { usuario: usuarioSinPassword, accessToken, refreshToken };
  },

  refresh: async (refreshTokenRecibido: string) => {
    const registrado = await refreshTokenRepository.findByToken(refreshTokenRecibido);

    if (!registrado || registrado.revocado || registrado.expiraEn < new Date()) {
      throw new UnauthorizedError("Refresh token inválido o expirado");
    }

    const usuario = await usuarioRepository.findById(registrado.usuarioId);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedError("Usuario no encontrado o inactivo");
    }

    await refreshTokenRepository.revocar(registrado.id);
    const nuevoRefreshToken = await generarRefreshToken(usuario.id);
    const nuevoAccessToken = generarAccessToken(usuario);

    return { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken };
  },

  logout: async (refreshTokenRecibido: string) => {
    const registrado = await refreshTokenRepository.findByToken(refreshTokenRecibido);
    if (registrado) {
      await refreshTokenRepository.revocar(registrado.id);
    }
  },

  update: async (id: number, data: ActualizarUsuarioDTO) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (data.rol === "ADMIN" && usuario.rol !== "ADMIN") {
      const admins = await usuarioRepository.findByRol("ADMIN");
      if (admins.length >= 1) {
        throw new ConflictError("Ya existe un administrador en el sistema");
      }
    }

    return usuarioRepository.update(id, data);
  },

  delete: async (id: number) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (usuario.rol === "ADMIN") {
      const admins = await usuarioRepository.findByRol("ADMIN");
      if (admins.length <= 1) {
        throw new ConflictError("No se puede eliminar el único administrador del sistema");
      }
    }

    await refreshTokenRepository.revocarTodosDeUsuario(id);
    return usuarioRepository.delete(id);
  },
};