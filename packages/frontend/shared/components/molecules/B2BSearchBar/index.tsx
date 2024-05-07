'use client';

import useB2BSearchBar from './_state/useB2BSearchBar';

export const SEARCH_BAR_QUERY_KEY = 'search';

const SearchBar = () => {
  const { b2BSearchBar, setB2BSearchBar } = useB2BSearchBar();

  return (
    <div className="Algolia-Autocomplete-Wrapper">
      <div className="Algolia-Autocomplete-Form-Container relative">
        <div
          className="aa-Autocomplete right-0 top-0 w-full"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-labelledby="autocomplete-0-label"
        >
          <form
            className="aa-Form"
            action=""
            role="search"
            onSubmit={(event) => {
              // TODO: Handle redirection on account page
              event.preventDefault();
            }}
          >
            <div className="aa-InputWrapperPrefix">
              <label
                className="aa-Label"
                htmlFor="autocomplete-0-input"
                id="autocomplete-0-label"
              >
                <button
                  className="aa-SubmitButton"
                  type="submit"
                  title="Rechercher"
                >
                  <svg
                    className="aa-SubmitIcon"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
                  </svg>
                </button>
              </label>
            </div>
            <div className="aa-InputWrapper">
              <input
                className="aa-Input"
                aria-autocomplete="both"
                aria-labelledby="autocomplete-0-label"
                id="autocomplete-0-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                enterKeyHint="go"
                spellCheck="false"
                placeholder="Rechercher un article"
                maxLength={512}
                type="search"
                onChange={(event) => setB2BSearchBar(event.target.value)}
                value={b2BSearchBar || ''}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="Algolia-Autocomplete-Panel-Container" />
      <div className="Algolia-Autocomplete-Overlay" />
    </div>
  );
};

export default SearchBar;
