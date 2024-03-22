import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./style.sass"
import {Button} from "../../components/Button/Button";
import {AppRouter} from "../../modules/router";
import {AppUserStore} from "../../modules/stores/UserStore";

export class HomePage extends ScReact.Component<any, any> {
    componentDidMount() {
        document.title = "Главная"

        const observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                        observer.unobserve(entry.target);
                    }
                });
            });


        const targetElements = document.querySelectorAll(".second .cards-container .card");

        targetElements.forEach((targetElement) => {
            observer.observe(targetElement);
        });
    }

    render(): VDomNode {
        return (
            <div className="home">

                <section className="first">
                    <div className="text-container">
                        <h1>YouNote - современный сервис для ведения заметок</h1>
                        <Button onClick={() => {
                            AppRouter.go(AppUserStore.state.isAuth ? "/notes" : "/login")
                        }} label="Попробовать"></Button>
                    </div>
                </section>

                <section className="second">
                    <h2>Функции и возможности</h2>
                        <div className="cards-container">
                            <div className="card">
                                <img src="./src/assets/notes.png" alt=""/>
                                <h3>Многофункциональность</h3>
                                <span>Сервис может использоваться для любых задач: планирование досуга, ведение конспектов, организация командной работы</span>
                            </div>
                            <div className="card">
                                <img src="./src/assets/accessibility.png" alt=""/>
                                <h3>Доступность</h3>
                                <span>Можно получить доступ к своим записям, имея под рукой любое устройство с доступом к интернет</span>
                            </div>
                            <div className="card">
                                <img src="./src/assets/success.png" alt=""/>
                                <h3>Удобство</h3>
                                <span>Простой, минималистичный и интуитивно понятный интерфейс дает возможность комфортного ведения заметок любым пользователем</span>
                            </div>
                            <div className="card">
                                <img src="./src/assets/personalization.png" alt=""/>
                                <h3>Персонализация</h3>
                                <span>Сервис позволяет оформлять записи, дополняя их картинками, оформляя заметки в соответствии с личными предпочтениями</span>
                            </div>
                        </div>
                </section>

            </div>
        );
    }
}