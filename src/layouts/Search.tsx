import config from "@/config/config.json";
import { plainify, slugify } from "@/lib/utils/textConverter";
import type { CollectionEntry } from "astro:content";
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFolder, FaSearch } from "react-icons/fa";

const { summary_length, post_folder } = config.settings;

export type SearchItem = {
  slug: string;
  data: CollectionEntry<"posts">["data"];
  content: any;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

const Search = ({ searchList }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["data.title", "data.categories", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 3,
    threshold: 0.5,
  });

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 2 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <section className="section">
      <div className="container">
        <div className="row mb-10 justify-center">
          <div className="lg:col-8">
            <div className="flex flex-nowrap">
              <input
                className="form-input border! border-e-0! p-4! rounded-s-lg bg-light! dark:bg-dark! w-full"
                placeholder="جست‌وجوی نوشته‌ها"
                type="search"
                name="search"
                aria-label="جست‌وجو"
                value={inputVal}
                onChange={handleChange}
                autoComplete="off"
                autoFocus
                ref={inputRef}
              />
              <button
                className="btn btn-primary before:hidden rounded-e-lg rounded-s-none h-full py-[21px]"
                type="submit"
                aria-label="جست‌وجو"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {searchResults?.length < 1 ? (
            <div className="mx-auto pt-5 text-center">
              <img
                className="mx-auto mb-6"
                src="/images/no-search-found.png"
                alt=""
              />
              <h1 className="h2 mb-4">
                {inputVal.length < 1 ? "عبارت جست‌وجو را وارد کنید" : "نتیجه‌ای پیدا نشد"}
              </h1>
              <p>
                {inputVal.length < 1
                  ? "می‌توانید بر اساس عنوان، دسته‌بندی یا برچسب جست‌وجو کنید."
                  : "عبارت دیگری را امتحان کنید."}
              </p>
            </div>
          ) : (
            searchResults?.map(({ item }, index) => {
              const { image, categories } = item.data;
              return (
                <div
                  className="mb-12 md:col-6 lg:col-4"
                  key={`search-${index}`}
                >
                  <div className="bg-body dark:bg-darkmode-body">
                    {image && (
                      <img
                        className="mb-6 w-full rounded"
                        src={item.data.image}
                        alt={item.data.title}
                        width={445}
                        height={230}
                      />
                    )}
                    <h4 className="mb-3">
                      <a href={`/${post_folder}/${item.slug}`}>
                        {item.data.title}
                      </a>
                    </h4>
                    <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1">
                      <li className="inline-block">
                        <FaRegFolder className={"-mt-1 me-2 inline-block"} />
                        {categories?.map((category: any, index: number) => (
                          <a
                            href={`/categories/${slugify(category)}`}
                            key={category}
                          >
                            {category}
                            {index !== categories.length - 1 && "، "}
                          </a>
                        ))}
                      </li>
                    </ul>
                    <p className="mb-6">
                      {plainify(item.content?.slice(0, Number(summary_length)))}
                    </p>
                    <a
                      className="btn btn-outline-primary btn-sm"
                      href={`/${post_folder}/${item.slug}`}
                    >
                      ادامه مطلب
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Search;
