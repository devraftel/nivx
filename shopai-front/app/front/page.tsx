import Image from 'next/image';
import welcome_avatar from '../../bg.jpg';

const LandingUI = () => {
  return (
    <div className="h-screen w-full bg-white">
      {' '}
      <Image
        alt="Welcome Avatars"
        src={welcome_avatar}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default LandingUI;
