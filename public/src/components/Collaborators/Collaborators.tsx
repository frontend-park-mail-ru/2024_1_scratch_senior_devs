import {ScReact} from "@veglem/screact";
import "./Collaborators.sass"
import {AppNotesStore, NotesStoreState} from "../../modules/stores/NotesStore";
import {imagesUlr} from "../../modules/api";

export class Collaborators extends ScReact.Component<any, any> {
    state = {
        collaborators: []
    }

    componentDidMount() {
        AppNotesStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        AppNotesStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:NotesStoreState) => {
        console.log("updateState")
        console.log(store.selectedNoteCollaborators)
        this.setState(state => ({
            ...state,
            collaborators: store.selectedNoteCollaborators
        }))
    }

    render() {
        return (
            <div className="collaborators-list-wrapper">
                {this.state.collaborators.map(collaborator => (
                    <div className="collaborator">
                        <img src={imagesUlr + collaborator.avatar} className="collaborator-avatar" alt=""/>
                        <div className={"collaborator-info"}>
                            <span>{collaborator.username}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}