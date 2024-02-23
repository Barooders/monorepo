import { RiFacebookFill } from 'react-icons/ri';
import {
  AiOutlineInstagram,
  AiFillLinkedin,
  AiFillYoutube,
} from 'react-icons/ai';
import { FaTiktok } from 'react-icons/fa';
import Link from '@/components/atoms/Link';

const SocialIcons = () => (
  <>
    <Link href="https://www.instagram.com/barooders_com/?hl=fr">
      <AiOutlineInstagram />
    </Link>
    <Link href="https://www.facebook.com/Barooders.outdoor/">
      <RiFacebookFill />
    </Link>
    <Link href="https://www.youtube.com/channel/UC7UlBU5_jBJ_uXvcaJz6Q4A">
      <AiFillYoutube />
    </Link>
    <Link href="https://www.tiktok.com/@barooders.com">
      <FaTiktok />
    </Link>
    <Link href="https://www.linkedin.com/company/barooders/">
      <AiFillLinkedin />
    </Link>
  </>
);

export default SocialIcons;
