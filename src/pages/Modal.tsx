import React, { useState } from 'react';
import { X, User, Calendar, MessageCircle } from 'lucide-react';

const ProfilePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Datos de ejemplo del usuario
  const userProfile = {
    name: "Ana María González",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    birthDate: "15 de Marzo, 1992",
    comment: "Me encanta viajar, la fotografía y conocer nuevas culturas. Siempre en busca de aventuras y experiencias que me ayuden a crecer como persona. ¡La vida es una gran aventura por descubrir!"
  };

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <div className="p-8">
      {/* Botón para abrir el popup */}
      <button
        onClick={openPopup}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <User size={20} />
        Ver Perfil
      </button>

      {/* Overlay y Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-90vh overflow-y-auto transform transition-all duration-300 scale-100">
            
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              >
                <X size={20} />
              </button>
              
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={userProfile.profileImage}
                    alt="Imagen de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {userProfile.name}
                </h2>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              
              {/* Fecha de nacimiento */}
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Fecha de Nacimiento</h3>
                  <p className="text-gray-600">{userProfile.birthDate}</p>
                </div>
              </div>

              {/* Comentario */}
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MessageCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Acerca de mí</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {userProfile.comment}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="px-6 pb-6">
              <button
                onClick={closePopup}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePopup;