import Link from '@/components/atoms/Link';
import last from 'lodash/last';
import slice from 'lodash/slice';
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import { useInstantSearch, usePagination } from 'react-instantsearch';

const CURRENT_PAGE_PADDING = 4;
const PAGE_LARGE_STEP = 5;

const PageLink = ({
  page,
  children,
  refine,
  createURL,
}: {
  page: number;
  children: React.ReactNode;
  refine: (page: number) => void;
  createURL: (page: number) => string;
}) => (
  <li>
    <Link
      href={createURL(page)}
      onClick={(event) => {
        event.preventDefault();
        refine(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {children}
    </Link>
  </li>
);

const Pagination = () => {
  const { results } = useInstantSearch();
  const {
    canRefine,
    refine,
    nbPages,
    currentRefinement,
    isFirstPage,
    isLastPage,
    createURL,
  } = usePagination({ totalPages: results.nbPages });

  if (!canRefine) {
    return null;
  }

  const getPageList = (pages: number[]): number[] => {
    const currentPage = last<number>(pages);

    if (currentPage === null || currentPage === undefined)
      return getPageList([1]);

    if (currentPage && currentPage >= nbPages)
      return [...slice(pages, 0, pages.length - 1), nbPages];

    let nextPage;

    if (Math.abs(currentPage - currentRefinement) <= CURRENT_PAGE_PADDING) {
      nextPage = currentPage + 1;
    } else if (
      currentPage < currentRefinement &&
      currentRefinement - currentPage < CURRENT_PAGE_PADDING + PAGE_LARGE_STEP
    ) {
      nextPage = currentRefinement - CURRENT_PAGE_PADDING;
    } else {
      nextPage =
        Math.ceil((currentPage + 1) / PAGE_LARGE_STEP) * PAGE_LARGE_STEP;
    }

    return getPageList([...pages, nextPage]);
  };

  return (
    <div className="mt-5 flex w-full justify-center">
      <ul className="flex flex-row flex-wrap items-center justify-center gap-4">
        {!isFirstPage && (
          <>
            <PageLink
              refine={refine}
              createURL={createURL}
              page={1}
            >
              <HiChevronDoubleLeft />
            </PageLink>
            <PageLink
              refine={refine}
              createURL={createURL}
              page={currentRefinement - 1}
            >
              <HiChevronLeft />
            </PageLink>
          </>
        )}
        {getPageList([]).map((page) => (
          <PageLink
            refine={refine}
            createURL={createURL}
            page={page - 1}
            key={page}
          >
            {page - 1 === currentRefinement ? <strong>{page}</strong> : page}
          </PageLink>
        ))}
        {!isLastPage && (
          <>
            <PageLink
              refine={refine}
              createURL={createURL}
              page={currentRefinement + 1}
            >
              <HiChevronRight />
            </PageLink>
            <PageLink
              refine={refine}
              createURL={createURL}
              page={nbPages - 1}
            >
              <HiChevronDoubleRight />
            </PageLink>
          </>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
