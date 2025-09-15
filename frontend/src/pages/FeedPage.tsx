import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, ThumbsUp, Camera, Smile } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4001/posts/';



const FeedPage = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const [posts, setPosts] = useState<any[]>([]);
    const [comment, setcomment] = useState('');
    const [newPost, setNewPost] = useState('');
    const [userId, setUserId] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token || !data?.user?.id) navigate('/');

                const response = await fetch(`${API_BASE}?userId=${data.user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const dataPosts = await response.json();

                if (dataPosts.posts) {
                    setUserId(dataPosts?.user?.id)
                    setPosts(dataPosts.posts);
                }
            } catch (error) {
                console.error('Error al cargar posts:', error);
            }
        };

        fetchPosts();
    }, [refreshTrigger]);

    const openModalWithPost = (post: any) => {
        setSelectedPost(post);
        setModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setcomment(e.target.value);
    };

    const handleLike = async (postId: number) => {

        const nuevoLike = {
            id: 0,
            usuario_id: data?.user?.id,
            post_id: postId,
            reaction: true
        }

        try {
            const res = await fetch(API_BASE + "like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoLike),
            });
            const data = await res.json();
            console.log("Like creado:", data);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al crear post:", error);
        }
    };

    const handleUnlike = async (postId: number) => {
        const unLike = {
            id: 0,
            usuario_id: data?.user?.id,
            post_id: postId,
            reaction: true
        }

        try {
            const res = await fetch(API_BASE + "unlike", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(unLike),
            });
            const data = await res.json();
            console.log("Like creado:", data);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al crear post:", error);
        }

    };

    const handleComent = async (postId: number) => {

        const nuevoComentario = {
            id: 0,
            usuario_id: data?.user?.id,
            post_id: postId,
            comentario: comment
        }

        try {
            const res = await fetch(API_BASE + "coment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoComentario),
            });
            const data = await res.json();
            console.log("Comentario creado:", data);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al crear comentario:", error);
        }
    };

    const toggleComments = (postId: number) => {
        if (!Array.isArray(posts)) return;

        const updatedPosts = posts.map(post =>
            post.id === postId
                ? { ...post, showcomments: !post.showcomments }
                : post
        );
        setcomment("");
        setPosts(updatedPosts);

    };

    useEffect(() => {
        console.log('posts ha cambiado:', posts);
    }, [posts]);

    const handleShare = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, shares: post.shares + 1 }
                : post
        ));
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const crearPost = async () => {
        const nuevoPost = {
            id: 0,
            usuario: data?.user?.id,
            content: newPost,
        }

        try {
            const res = await fetch(API_BASE + "publicar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoPost),
            });

            const data = await res.json();
            console.log("Post creado:", data);
            setNewPost('');
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al crear post:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}

            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-purple-900">Red Social</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="text-lg font-bold text-gray-600">{data?.user?.primer_nombre} {data?.user?.segundo_nombre} {data?.user?.primer_apellido}</div>
                            <div className="text-s  text-gray-600">{data?.user?.email}</div>
                            <button onClick={cerrarSesion}>
                                <span className="font-medium">Cerrar Sesion</span>
                            </button>

                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto py-6 px-4">
                {/* Create Post */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="¿Qué estás pensando?"
                                className="w-full p-3 bg-gray-100 rounded-lg border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"

                            />
                            <div className="flex justify-between items-center mt-3">

                                <button
                                    onClick={crearPost}
                                    disabled={!newPost.trim()}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Publicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow mb-4">
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1">
                                        <h3 className="font-semibold text-gray-900">{post.usuario.name}</h3>
                                        {post.usuario.verified && (
                                            <span className="text-blue-500 text-sm">✓</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 pb-3">
                            <p className="text-gray-800 leading-relaxed">{post.content}</p>
                        </div>

                        {/* Post Image */}
                        {post.image && (
                            <div className="px-0">
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        )}

                        {/* Post Stats */}
                        <div className="px-4 py-2 flex justify-between items-center text-sm text-gray-500 border-b">
                            <div className="flex space-x-4">
                                <span>{post.likes} Me gusta </span>
                                <span>{post.comments} Comentarios</span>
                            </div>
                            <div className="flex space-x-12">
                                <span> {new Date(post.creado_at).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        </div>
                        {/* Post Actions */}
                        <div className="p-2 flex justify-around border-b">
                            <button
                                onClick={() => post.liked ? handleUnlike(post.id) : handleLike(post.id)}
                                className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors flex-1 mx-1 ${post.liked
                                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <ThumbsUp size={20} className={post.liked ? 'fill-current' : ''} />
                                <span className="font-medium">Me gusta</span>
                            </button>
                            <button
                                onClick={() => toggleComments(post.id)}
                                className="flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors flex-1 mx-1 text-gray-600 hover:bg-gray-100"
                            >
                                <MessageCircle size={20} />
                                <span className="font-medium">Comentar</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {post.showcomments && (
                            <div className="p-4 bg-gray-50">
                                {/* Existing Comments */}
                                {post.commentslist.map((comment: any) => (
                                    <div key={comment.id} className="flex space-x-3 mb-3">
                                        <img
                                            src="logo192.png"
                                            alt={comment.usuario}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-white rounded-lg px-3 py-2">
                                                <h4 className="font-semibold text-sm text-gray-900">{comment.usuario}</h4>
                                                <p className="text-sm text-gray-800">{comment.text}</p>
                                            </div>
                                            <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                                                <button className="hover:text-gray-700">Me gusta</button>
                                                <button className="hover:text-gray-700">Responder</button>
                                                <span>{comment.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* New Comment Input */}
                                <div className="flex space-x-3 mt-4">
                                    <img
                                        src="/logo192.png"
                                        alt="Tu avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={comment}
                                            onChange={handleChange}
                                            placeholder="Escribe un comentario..."
                                            className="w-full p-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={() => handleComent(post.id)}
                                        className={`w-fit py-1 px-4 rounded-lg font-medium text-white transition duration-200 ${false
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                                            }`}
                                    >
                                        Responder
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );




};




export default FeedPage;