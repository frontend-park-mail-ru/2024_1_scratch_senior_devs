import {ScReact} from '@veglem/screact';
import './style.sass';

class AuthPageSkeleton extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="auth-page-skeleton-wrapper">
                <div className="auth-form-container-skeleton">
                    <div className="auth-form-skeleton"></div>
                </div>
            </div>
        );
    }
}

export default AuthPageSkeleton;
