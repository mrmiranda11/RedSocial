import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PostData } from '../models/PostData';
import { LikeData } from '../models/LikeData';


export class PostService {

  constructor(private pool: Pool) { }

  async getPosts(userid: number, limit: number, offset: number) {
    console.log("userid",userid)
    const result = await this.pool.query(`
      SELECT  
        p.id,
        p.content,
        p.image,
        COUNT(DISTINCT l.id) AS likes,
        COUNT(DISTINCT c.id) AS comments,
        MAX(CASE 
          WHEN l.usuario_id = $1 THEN 1 
          ELSE 0 
        END)::boolean AS liked,    
        p.showcomments,
        p.creado_at,
        json_build_object(
          'name', u.primer_nombre || ' ' || u.primer_apellido,
          'avatar', u.primer_apellido,
          'verified', TRUE
        ) AS usuario,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'usuario', cu.primer_nombre || ' ' || cu.primer_apellido,
              'text', c.texto,
              'time', c.creado_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS commentsList

      FROM posts p
      LEFT JOIN usuarios u ON p.usuario = u.id
      LEFT JOIN coments c ON c.post_id = p.id
      LEFT JOIN usuarios cu ON cu.id = c.usuario
      LEFT JOIN likes l ON l.post_id = p.id
      GROUP BY p.id, u.primer_nombre, u.primer_apellido
      ORDER BY p.id DESC
    LIMIT $2 OFFSET $3
    `, [userid,limit, offset]);

    // Get total count
    const countResult = await this.pool.query('SELECT COUNT(*) as total FROM posts');
    const total = parseInt(countResult.rows[0].total);
    //console.log(result.rows);
    return {
      posts: result.rows,
      total:total
    };
  }

  async registrarPost(postData: PostData) {

    // Insertar post
    console.log("*************registrarPost********");
    
    const result = await this.pool.query(
      `
      INSERT INTO posts(usuario, content, image, likes, comments, liked, showcomments)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, usuario, content, image, likes, comments, liked, showcomments, creado_at
      `,
      [
        postData.usuario,
        postData.content,
        postData.image,
        postData.likes || 0,
        postData.comments || 0,
        postData.liked || false,
        postData.showcomments || false
      ]
    );
    console.log("*************INSERT********");
    const post = result.rows[0];
    const token = this.generateToken(post.id);

    return {
      message: 'Post Creado correctamente',
      token,
      post: {
        id: post.id,
        usuario: post.usuario,
        content: post.content,
        likes:post.likes,
        comments:post.comments,
        liked:post.liked,
        creado_at:post.creado_at
        
      }
    };
  }

  async registrarLike(likeData: LikeData) {

    // Insertar like
    console.log("*************registrarLike********",likeData);
    
    const result = await this.pool.query(
      `INSERT INTO likes(usuario_id, post_id, reaction)
        VALUES ($1, $2, $3)
      RETURNING id, usuario_id, post_id, reaction, creado_at
      `,
      [
        likeData.usuario_id,
        likeData.post_id,
        likeData.reaction,
      ]
    );
    console.log("*************INSERT********");
    const like = result.rows[0];
    const token = this.generateToken(like.id);

    return {
      message: 'Post Creado correctamente',
      token,
      like: {
        id: like.id,
        usuario_id: like.usuario_id,
        post_id: like.post_id,
        reaction:like.reaction,
        creado_at:like.creado_at,
      }
    };
  }

  async borrarLike({ usuario_id, post_id }: LikeData) {

    console.log("*************borroarLike********",usuario_id);
    const result = await this.pool.query(
      `DELETE FROM likes WHERE usuario_id = $1 AND post_id = $2
       RETURNING *
      `,
      [
        usuario_id,
        post_id,
      ]
    );
    console.log("*************DELE********");
    
    const token = this.generateToken(1);
    if (result.rowCount === 0) {
      return {
          message: 'Like no encontrado',
          token
        };
    }

    return {
      message: 'Like Eliminado correctamente',
      token
    };
  }

  private generateToken(userId: number): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }
}