import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign} from 'hono/jwt'
import {signupInput, signinInput} from "@kapil_jain/medium-lib";

export const userRouter= new Hono<{
  Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);

    if (!success) {
      console.log("❌ Invalid signup body:", body);
      c.status(400);
      return c.json({ msg: 'Invalid signup data' });
    }

    const newuser = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
        name: body.name
      },
    });

    const secret = c.env.JWT_SECRET;
    const token = await sign({ id: newuser.id }, secret);

    return c.json({ token });
  } catch (e) {
    if (e instanceof Error) {
      console.error("❗ Signup failed:", e.message, e.stack);
    } else {
      console.error("❗ Unknown error during signup:", e);
    }
    c.status(500);
    return c.json({ msg: "Internal server error" });
  }
});





// userRouter.post('/signup', async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL	,
//   }).$extends(withAccelerate());

//   const body = await c.req.json();
//   const { success } = signupInput.safeParse(body);
//     if (!success) {
//         c.status(411);
//         return c.json({
//             message: "Inputs not correct"
//         })
//     }
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email: body.username,
//         password: body.password
//       }
//     });
//     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
//     return c.json({ jwt });
//   } catch(e) {
//     console.error("Signup failed:", e); // Add this
//     c.status(500); // More accurate than 403
//     return c.json({ error: "error while signing up" });
//   }
// })


// userRouter.post('/signin', async (c) => {
//   const body = await c.req.json();
//   const { success } = signinInput.safeParse(body);
//   if (!success) {
//       c.status(411);
//       return c.json({
//           message: "Inputs not correct"
//       })
//   }

//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate())

//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         email: body.email,
//         password: body.password,
//       }
//     })
//     if (!user) {
//       c.status(403);
//       return c.json({
//         message: "Incorrect creds"
//       })
//     }
//     const jwt = await sign({
//       id: user.id
//     }, c.env.JWT_SECRET);

//     return c.json(jwt)
//   } catch(e) {
//     console.log(e);
//     c.status(411);
//     return c.json('Invalid')
//   }
// })
userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      }
    });
    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect creds"
      });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ token: jwt }); // ✅✅ This line fixed!
  } catch(e) {
    console.log(e);
    c.status(411);
    return c.json('Invalid');
  }
});
