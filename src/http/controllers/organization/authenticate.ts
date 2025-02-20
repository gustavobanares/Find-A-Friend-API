import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/services/factories/make-authenticate-use-case";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    passwordHash: z.string().min(6),
  });

  const { email, passwordHash } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { organization } = await authenticateUseCase.execute({
      email,
      passwordHash,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
          expiresIn: "7d",
        }
      }
    )

    return reply
    .setCookie('refreshToken', refreshToken,{
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
