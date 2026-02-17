import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
    const location = useLocation();

    // Auto-generate breadcrumbs if items not provided
    const generateBreadcrumbs = () => {
        const pathnames = location.pathname.split('/').filter(x => x);
        const breadcrumbs = [{ label: 'Home', path: '/' }];

        pathnames.forEach((name, index) => {
            const path = `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = name
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            breadcrumbs.push({ label, path });
        });

        return breadcrumbs;
    };

    const breadcrumbs = items || generateBreadcrumbs();

    return (
        <nav className="flex items-center space-x-2 text-sm mb-6 animate-in fade-in slide-in-from-top duration-300">
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                    {index > 0 && (
                        <i className="fas fa-chevron-right text-xs text-slate-300"></i>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                        <span className="font-bold text-[#496279] text-xs uppercase tracking-wider">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="text-slate-400 hover:text-[#4c8051] transition-colors font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5"
                        >
                            {index === 0 && <i className="fas fa-home text-xs"></i>}
                            {crumb.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
