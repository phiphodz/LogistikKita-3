import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';

const ContactUs = ({ db, appId, darkMode }) => {
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [status, setStatus] = useState(''); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firestore = db || getFirestore();
        if (!firestore) return;
        
        setStatus('sending');
        try {
            const messagesRef = collection(firestore, 'artifacts', appId, 'public', 'data', 'messages');
            await addDoc(messagesRef, { ...form, createdAt: serverTimestamp() });
            setStatus('success'); 
            setForm({ name: '', phone: '', message: '' });
            setTimeout(() => setStatus(''), 5000); 
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="py-24 relative overflow-hidden" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row ${darkMode ? 'bg-slate-800 border border-white/5' : 'bg-white'}`}>
                    
                    {/* BAGIAN KIRI: INFO KONTAK (MERAH) */}
                    <div className="p-12 md:w-2/5 bg-primary text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
                            <p className="opacity-90 mb-12 text-lg leading-relaxed">Punya pertanyaan atau butuh penawaran khusus? Tim kami siap membantu 24/7.</p>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 flex-shrink-0 mt-1 opacity-80"/>
                                    {/* ALAMAT FINAL */}
                                    <p className="leading-relaxed">Jl. Terusan Irian Jaya No.8, Gedangklutuk RT 004 RW 009, Banjaragung, Puri, Kab Mojokerto</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="w-6 h-6 flex-shrink-0 opacity-80"/>
                                    {/* NOMOR WA FINAL */}
                                    <p className="font-bold">+62 858-1348-7753</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="w-6 h-6 flex-shrink-0 opacity-80"/>
                                    <p>cs@logistikkita.id</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
                             <p className="text-sm opacity-70">Respon cepat via WhatsApp atau Telepon.</p>
                        </div>
                    </div>
                    
                    {/* BAGIAN KANAN: FORMULIR */}
                    <div className="p-12 md:w-3/5">
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Kirim Pesan / Request Penawaran</h3>
                        <p className={`mb-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Silakan isi formulir di bawah, kami akan segera menghubungi Anda.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input fields... (sama seperti sebelumnya) */}
                            <input className={`w-full p-4 rounded-xl border-2 outline-none transition font-medium ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-primary' : 'bg-gray-50 border-gray-100 text-slate-900 focus:border-primary focus:bg-white'}`} placeholder="Nama Lengkap Anda" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            <input className={`w-full p-4 rounded-xl border-2 outline-none transition font-medium ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-primary' : 'bg-gray-50 border-gray-100 text-slate-900 focus:border-primary focus:bg-white'}`} placeholder="Nomor WhatsApp / Telepon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                            <textarea className={`w-full p-4 rounded-xl border-2 outline-none transition font-medium h-36 resize-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-primary' : 'bg-gray-50 border-gray-100 text-slate-900 focus:border-primary focus:bg-white'}`} placeholder="Tulis pesan atau detail kebutuhan pengiriman Anda..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required></textarea>
                            
                            <button disabled={status === 'sending' || status === 'success'} className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${status === 'success' ? 'bg-green-500 text-white cursor-default' : 'bg-primary hover:bg-red-600 text-white shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1'}`}>
                                {status === 'sending' ? 'Mengirim...' : (status === 'success' ? 'Pesan Terkirim! Terima Kasih.' : <>Kirim Pesan Sekarang <Send className="w-5 h-5" /></>)}
                            </button>
                            {status === 'error' && <p className="text-red-500 text-center mt-2">Gagal mengirim. Silakan coba lagi atau hubungi WA.</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContactUs;
