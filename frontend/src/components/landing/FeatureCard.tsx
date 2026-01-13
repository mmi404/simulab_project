import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    details?: string[];
    color?: string;
    onClick?: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, details, color = 'blue', onClick }: FeatureCardProps) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div
            onClick={onClick}
            className={`group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>

            <p className="text-gray-600 mb-4 flex-grow">
                {description}
            </p>

            {details && (
                <div className="space-y-2 border-t border-gray-100 pt-4 mt-auto">
                    {details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-${color}-500 transition-colors`}></div>
                            {detail}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeatureCard;
