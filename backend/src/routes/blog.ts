import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { createBlogInput, updateBlogInput } from "@kapil_jain/medium-lib";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// blogRouter.use('/*',async (c,next)=>{
//   const header = c.req.header('authorization') || "" ;
//   try{
//     const res = await verify(header,c.env.JWT_SECRET) as JWTPayload;
//     if(res){
//         const id = res.id || "";
//         c.set('userId', id.toString());
//       await next();
//     }
//     else{
//       c.status(401);
//       return c.json({msg:'Unauthorized'});
//     }
//   }catch(err){
//     c.status(403);
//     return c.json({
//       message:"You are not logged in"
//     })
//   }
  
// });

blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header('authorization') || "";

  // Extract token from "Bearer <token>"
  const token = authHeader.replace("Bearer ", "");

  try {
    const res = await verify(token, c.env.JWT_SECRET) as JWTPayload;

    if (res) {
      const id = res.id || "";
      c.set('userId', id.toString());
      await next();
    } else {
      c.status(401);
      return c.json({ msg: 'Unauthorized' });
    }
  } catch (err) {
    c.status(403);
    return c.json({
      message: "You are not logged in"
    });
  }
});

blogRouter.post('/',async (c) => {
  try{
      const body = await c.req.json();

      const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    
      const {success} = createBlogInput.safeParse(body);
      if(!success){
          return c.json({
              msg:"Invalid Inputs",
          })
      }
          const authorId = c.get("userId");
          console.log(authorId);
          const post = await prisma.post.create({
              data:{
                  title:body.title,
                  content:body.content,
                  authorId:authorId,
              }
          })
          return c.json({
              id:post.id,
          });
  }
  catch(e){
      console.log(e);
      c.status(500);
      return c.json({msg:'An error occurred while creating a post'});
  }
});


blogRouter.put('/', async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.post.update({
      where: {
          id: body.id
      }, 
      data: {
          title: body.title,
          content: body.content
      }
  })

  return c.json({
      id: blog.id
  })
})


blogRouter.get('/', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const blog = await prisma.post.findFirst ({
      where:{
        id:body.id
      },
    })

    return c.json({
      blog
    });
  }catch(e){
    return c.json({
      message:"Error while fetchong blog post"
    });
  }
})

// blogRouter.get('/bulk', async (c) => {
//   const body = await c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl:c.env.DATABASE_URL,
//   }).$extends(withAccelerate())

//   const blogs = await prisma.post.findMany();

//   return c.json({
//     blogs
//   })
// })

// blogRouter.get('/bulk',async (c) => {
//   const prisma = new PrismaClient({
//       datasourceUrl: c.env?.DATABASE_URL, 
//   }).$extends(withAccelerate());
//   const blogs = await prisma.post.findMany({
//       select:{
//           content: true,
//           title: true,
//           id: true,
//           author: {
//               select: {
//                   name: true
//               }
//           }
         
//       }
//   });

//   return c.json({
//       blogs
//   })
// })
blogRouter.get('/bulk',async (c) => {
  const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany({
    select:{
      content: true,
      title: true,
      id: true,
      author: {
          select: {
              name: true
          }
      }
     
  }
  });

  return c.json({blogs:blogs});
});

// blogRouter.get('/:id',async (c) => {
//   const prisma = new PrismaClient({
//       datasourceUrl:c.env.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const blogid = c.req.param('id');
//   const blog = await prisma.post.findUnique({
//       where:{
//           id:blogid,
//       }
//   })
//   return c.json({
//       blog,
//   });
// });

blogRouter.get('/:id',async (c) => {
  const id = c.req.param("id")
  const prisma = new PrismaClient({
  datasourceUrl: c.env?.DATABASE_URL,
}).$extends(withAccelerate());

  try {
  const blog = await prisma.post.findFirst({
      where: {
          id: id
      },
      select: {
          id: true,
          title: true,
          content: true,
          author: {
              select: {
                  name: true
              }
          }
      }
  })
      return c.json({
          blog
      });
  } catch(e){
      c.status(411);
      return c.json({
          msg: "Error while fecthing the blog post"
      })
  }
})