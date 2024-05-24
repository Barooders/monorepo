import Link from '@/components/atoms/Link';
import { Heading } from '@medusajs/ui';

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">Need help?</Heading>
      <div className="text-base-regular my-2">
        <ul className="flex flex-col gap-y-2">
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/contact">Returns & Exchanges</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
