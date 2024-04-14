import {ScReact} from '@veglem/screact';
import './style.sass';

class NotesPageSkeleton extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="notes-page-skeleton-wrapper">
                <aside>
                    <div className="search-bar-skeleton"></div>
                    <div className="notes-container-skeleton">
                        <div className="note-skeleton"></div>
                        <div className="note-skeleton"></div>
                        <div className="note-skeleton"></div>
                        <div className="note-skeleton"></div>
                    </div>
                </aside>
            </div>
        );
    }
}

export default NotesPageSkeleton;
