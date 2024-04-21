import {ScReact} from '@veglem/screact';
import {CarouselItem} from '../CarouselItem/CarouselItem';

export class Carousel extends ScReact.Component<any, any> {
    render() {
        const items = [
            {
                title: 'title 1',
                description: 'desc 1'
            },
            {
                title: 'title 2',
                description: 'desc 2'
            },
            {
                title: 'title 3',
                description: 'desc 3'
            },
        ];

        return (
            <div className="carousel">
                <div className="inner">
                    {items.map(item => (
                        <CarouselItem item={item} />
                    ))}
                </div>
            </div>
        );
    }
}