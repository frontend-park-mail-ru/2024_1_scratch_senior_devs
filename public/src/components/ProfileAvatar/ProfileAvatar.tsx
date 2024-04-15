import {ScReact} from '@veglem/screact';
import {Img} from '../Image/Image';
import {imagesUlr} from '../../modules/api';
import {AppToasts} from '../../modules/toasts';
import {AppDispatcher} from '../../modules/dispatcher';
import {AppUserStore, UserActions, UserStoreState} from '../../modules/stores/UserStore';
import './ProfileAvatar.sass';
import {AvatarUploadLoader} from '../AvatarUplodaLoader/AvatarUploadLoader';
import {crop} from '../../modules/utils';
import {MAX_AVATAR_SIZE} from '../../utils/consts';

type ProfileAvatarState = {
    uploadAnimation: boolean,
    timer: Date
}

export class ProfileAvatar extends ScReact.Component<any, ProfileAvatarState> {
    state = {
        uploadAnimation: false,
        timer: null
    };

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState);
    }

    updateState = (store:UserStoreState) => {
        this.setState(state => {
            if (state.uploadAnimation && !store.avatarUploadAnimation) {
                return {
                    ...state,
                    timer: new Date(),
                    uploadAnimation: store.avatarUploadAnimation
                };
            }

            return {
                ...state,
                uploadAnimation: store.avatarUploadAnimation
            };
        });
    };

    handlePhotoUpload = (e) => {
        if (!e.target) {
            return;
        }

        if (this.state.timer) {
            const now = new Date().valueOf();
            const differences = now - this.state.timer;
            if (differences < 5000) {
                AppToasts.info('Подождите 5 секунд между сменой аватарки');
                e.target.value = null;
                return;
            }
        }

        const file = e.target.files[0];
        console.log(file.type);

        if (file.size > MAX_AVATAR_SIZE) {
            AppToasts.error('Фото слишком большое');
            e.target.value = null;
            return;
        }

        const reader = new FileReader();

        reader.addEventListener(
            'load',
            () => {
                crop(reader.result as string).then(canvas => {
                    canvas.toBlob((blob) => {
                        const croppedFile = new File([blob], file.name, { type: file.type });
                        AppDispatcher.dispatch(UserActions.UPDATE_AVATAR, croppedFile);
                    }, file.type);
                });
            },
            false,
        );

        if (file) {
            reader.readAsDataURL(file);
        }

        e.target.value = null;
    };

    render() {
        return (
            <div className="user-avatar-container">

                <img src={imagesUlr + this.props.avatarUrl} className={'user-avatar ' + (this.state.uploadAnimation ? 'loading' : '')}/>

                <form className="upload-preview">
                    <input type="file" accept=".jpg,.png" id="upload-image-input" hidden="true" onchange={this.handlePhotoUpload}/>
                    <label htmlFor="upload-image-input"></label>
                    <Img src="photo.svg" className="upload-preview-icon"/>
                </form>

                <AvatarUploadLoader active={this.state.uploadAnimation}/>

            </div>
        );
    }
}