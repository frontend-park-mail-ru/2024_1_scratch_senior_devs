import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./index.sass"
import {DonutChart} from "../../components/ DonutChart/DonutChart";
import {BarChart} from "../../components/BarChart/BarChart";

export class CSATPage extends ScReact.Component<any, any> {
    render(): VDomNode {
        return (
            <div className="csat-page-wrapper">

                <div className="csat-statictic">

                    {/*<DonutChart />*/}

                    <BarChart />

                </div>

            </div>
        )
    }
}