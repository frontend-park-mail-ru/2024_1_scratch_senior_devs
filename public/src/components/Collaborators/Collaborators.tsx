import {ScReact} from "@veglem/screact";
import "./Collaborators.sass"
import {AppNotesStore, NotesStoreState} from "../../modules/stores/NotesStore";

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
        this.setState(state => ({
            ...state,
            collaborators: store.selectedNoteCollaborators
        }))
    }

    render() {
        return (
            <div>
                <h3>Collaborators</h3>
                {this.state.collaborators.map(collaborator => (
                    <h2>{collaborator}</h2>
                ))}
            </div>
        )
    }
}