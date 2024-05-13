import {ScReact} from "@veglem/screact";
import "./Collaborators.sass"
import {AppNotesStore, NotesStoreState} from "../../modules/stores/NotesStore";
import {imagesUlr} from "../../modules/api";

export class Collaborators extends ScReact.Component<any, any> {
    state = {
        collaborators: []
    }

    componentDidMount() {
        console.log("componentDidMount")
        AppNotesStore.SubscribeToStore(this.updateState)
    }

    componentWillUnmount() {
        console.log("UnSubscribeToStore")
        AppNotesStore.UnSubscribeToStore(this.updateState)
    }

    updateState = (store:NotesStoreState) => {
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