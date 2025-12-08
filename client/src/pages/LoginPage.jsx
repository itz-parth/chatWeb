import { useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import '../App.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log('✓ User successfully signed in:', result.user);
        } catch (e) {
            console.error('✗ Error during sign-in:', e);
        }
    };

    const glassCard = {
        width: '25vw',
        height: '60vh',
        backdropFilter: 'blur(3px) saturate(200%)',
        WebkitBackdropFilter: 'blur(3px) saturate(200%)',
        backgroundColor: 'rgba(155, 155, 155, 0.73)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.125)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    };

    if (loading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-[url('/assets/login_bg.jpg')] bg-cover bg-center w-screen h-screen flex justify-center items-center">
            <div style={glassCard}>
                <h1 className="text-white text-2xl mb-6">Login to the App</h1>
                <button
                    onClick={signInWithGoogle}
                    className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200 transition"
                >
                    Click to Sign In
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
