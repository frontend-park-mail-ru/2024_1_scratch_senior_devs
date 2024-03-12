import {ScReact} from "@veglem/screact"
import {Button} from "./components/Button/Button";

export class App extends ScReact.Component<any, any> {
    state = {
        name: "Hello",
        values: []
    }

    render() {
        return(
            <div>
                <p>{this.state.name}</p>
                <Button clickHandler={() => {
                    this.setState(s => ({...s, name: this.state.name + " 1", values: [...this.state.values, this.state.name]}))
                }
                }></Button>
                {
                    this.state.values.length < 2 ?
                        <div key1={"if"}>Меньше 2</div> :
                        <div key1={"if1"}>больше или равно 2</div>
                }
                {this.state.values.map((val) => {
                    return <div key1={val}>{val}</div>
                })}
            </div>)
    }
}