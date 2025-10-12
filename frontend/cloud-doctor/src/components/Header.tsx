import { useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 로고 */}
        <a href="/" className="text-2xl font-bold text-gray-800">
          CloudDoctor
        </a>

        {/* 내비게이션 */}
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
                <Link to="/guide" className="text-blue-600 underline">
                    가이드
                </Link>
            </li>
            <li>
                <Link to="/prowler" className="text-blue-600 underline">
                    Prowler
                </Link>
            </li>
            <li>
                <Link to="/checklist" className="text-blue-600 underline">
                체크리스트
                </Link>
            </li>
          </ul>
        </nav>

        {/* 버튼 */}
        <div className="hidden md:block">
          <a
            href="#solution"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            상담하기
          </a>
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <div className="block md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-6 py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/guide" 
                  className="block text-blue-600 underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  가이드
                </Link>
              </li>
              <li>
                <Link 
                  to="/prowler" 
                  className="block text-blue-600 underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prowler
                </Link>
              </li>
              <li>
                <Link 
                  to="/checklist" 
                  className="block text-blue-600 underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  체크리스트
                </Link>
              </li>
              <li>
                <a
                  href="#solution"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  상담하기
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
