import { Play } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-current" />
                    </div>
                    SimuLab
                </div>
                <div className="flex gap-8 text-slate-500 font-medium">
                    <a href="#" className="hover:text-primary transition-colors">About</a>
                    <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                    <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
                <p className="text-slate-400 text-sm">© 2026 SimuLab. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
