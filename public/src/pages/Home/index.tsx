import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import './style.sass';
import {AppRouter} from '../../modules/router';
import {AppUserStore} from '../../modules/stores/UserStore';
import {ShiningButton} from '../../components/ShiningButton/ShinigButton';
import {Card} from '../../components/Card/Card';

export class HomePage extends ScReact.Component<any, any> {
    componentDidMount() {
        document.title = 'Главная';
        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            });

        const targetElements = document.querySelectorAll('.second .cards-container .card');

        targetElements.forEach((targetElement) => {
            observer.observe(targetElement);
        });
    }

    handleButtonClick = () => {
        const url = AppUserStore.state.isAuth ? '/notes' : '/login';
        AppRouter.go(url);
    };

    render(): VDomNode {
        return (
            <div className="home__wrapper">
                <section className="hero">
                    <div className="hero__body">
                        <h1 className="hero__body-title">YouNote - современный сервис для ведения заметок</h1>
                        <ShiningButton label="Попробовать" onClick={this.handleButtonClick}/>
                    </div>
                </section>
                <section className="about">
                    <h2 className="about__title">Функции и возможности</h2>
                    <div className="about__container">
                        <Card
                            icon="./src/assets/notes.png"
                            title="Многофункциональность"
                            description="Сервис может использоваться для любых задач: планирование досуга, ведение конспектов, организация командной работы"
                        />
                        <Card
                            icon="./src/assets/accessibility.png"
                            title="Доступность"
                            description="Можно получить доступ к своим записям, имея под рукой любое устройство с доступом к интернет"
                        />
                        <Card
                            icon="./src/assets/success.png"
                            title="Удобство"
                            description="Простой, минималистичный и интуитивно понятный интерфейс дает возможность комфортного ведения заметок любым пользователем"
                        />
                        <Card
                            icon="./src/assets/personalization.png"
                            title="Персонализация"
                            description="Можно получить доступ к своим записям, имея под рукой любое устройство с доступом к интернет"
                        />
                    </div>
                </section>
            </div>
        );
    }
}