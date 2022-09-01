import ProfileForm from './ProfileForm';
import './UserProfile.css';

const UserProfile = () => {
    return (
        <section className={"profile"}>
            <h1>Your User Profile</h1>
            <ProfileForm/>
        </section>
    );
};

export default UserProfile;
