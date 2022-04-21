import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  onClick?: (id: string) => void;
  link: string;
  showTitle?: boolean;
}
export function NavHeader(props: Props) {
  return (
    <nav>
      <Link to={props.link}>
        {/* <a href={ props.link } className="flex items-center"> */}
        <div className="flex items-center">
          <div className="mr-3 bg-primary text-primary-light p-2 rounded-full h-10 w-10 mt-1 flex items-start justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>

          {props.showTitle && (
            <div className="text-lg text-primary-300 font-header no-underline text-primary-light hover:text-white hover:no-underline">
              Examenkompas
            </div>
          )}
        </div>
        {/* </a> */}
      </Link>
    </nav>
  );
}
