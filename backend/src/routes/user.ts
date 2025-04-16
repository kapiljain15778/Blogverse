import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign} from 'hono/jwt'
import {signupInput, signinInput} from "@kapil_jain/medium-lib";


// const signupInput = z.object({
//   username:z.string().email(),
//   password:z.string().min(6),
//   name:z.string().optional()
// })

export const userRouter= new Hono<{
  Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();




userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  // const { success } = signupInput.safeParse(body);
  //   if (!success) {
  //       c.status(411);
  //       return c.json({
  //           message: "Inputs not correct"
  //       })
  //   }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch(e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
})

// userRouter.post('/api/v1/signin', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL	,
//   }).$extends(withAccelerate());

//   const body = await c.req.json();
//   const user = await prisma.user.findUnique({
//     where: {
//       email: body.email,
//       password:body.password
//     }
//   });

//   if (!user) {
//     c.status(403);
//     return c.json({ error: "user not found" });
//   }

//   const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//   return c.json({ jwt });
// })

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      }
    })
    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect creds"
      })
    }
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json(jwt)
  } catch(e) {
    console.log(e);
    c.status(411);
    return c.json('Invalid')
  }
})