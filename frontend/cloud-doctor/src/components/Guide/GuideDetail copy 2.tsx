import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type IncidentRef = {
  title: string;
  date?: string;
  note?: string;
};
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("http://back.takustory.site/api/guideline"); // ✅ API 주소 변경
      const data = await res.json();
      setGuidelines(data);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

export type GuideItemProps = {
  id: string;
  category: string;
  severity: number | string;
  title: string;
  description: string;
  whatHappens: string;
  checkSteps: string;
  remediation: string[];
  sideEffect: string;
  examples: IncidentRef[];
  note?: string;
};

const sampleData: GuideItemProps = {
  id: "1",
  category: "EC2",
  severity: 2,
  title: "IMDS 보안 통제 미적용으로 인한 임시 자격 증명 탈취",
  description:
    "IMDS(Instance Metadata Service)는 AWS에서 실행되는 EC2 인스턴스가 메타데이터 및 사용자 데이터를 조회할 수 있는 서비스입니다. IMDS 접근이 통제되지 않으면 단 한 번의 취약점으로도 임시 자격증명이 탈취되어 계정 전체가 악용될 수 있습니다. 특히 IMDS가 오래된 버전(IMDSv1)으로 남아 있거나, 인스턴스 역할에 권한이 과도하게 주어져 있으면 피해 규모가 커질 수 있습니다.",
  whatHappens:
    "공격자가 웹/앱의 취약점을 이용해 IMDS를 호출하면, 인스턴스에 부여된 IAM 역할의 임시 자격증명(AccessKey, Secret, Token)을 얻을 수 있습니다. 탈취된 자격증명은 S3, EC2, IAM 등 권한 범위 내 AWS API 호출에 사용되어 데이터 탈취, 권한 상승, 백도어 생성과 같은 추가 공격으로 이어집니다.",
  checkSteps:
    "EC2 → 인스턴스 → 해당 인스턴스 → 작업 → 인스턴스 설정 → 인스턴스 메타데이터의 태그 허용\n(IMDSv2가 Optional로 설정되어 있으면 취약합니다.)",
  remediation: [
    "모든 EC2 인스턴스에서 IMDSv2를 필수로 설정해야 합니다.",
    "인스턴스에 부여된 IAM 역할은 최소 권한 원칙(Least Privilege)을 적용하세요.",
  ],
  sideEffect: "없음",
  examples: [
    {
      title: "Capital One 데이터 유출",
      date: "2019-04",
      note: "IMDS/Role 관련 사고",
    },
    { title: "Prezi SSRF 침해", date: "2014-10" },
    {
      title: "sysdig 분석",
      date: "2023-02",
      note: "IMDSv1 및 과도한 IAM 권한",
    },
    { title: "qualys IMDSv1 취약점 분석", date: "2025-06" },
  ],
  note: "",
};

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "bg-blue-600",
}) => (
  <span
    className={`inline-block px-2 py-0.5 text-sm font-medium text-white rounded ${color}`}
  >
    {children}
  </span>
);

const GuideItem: React.FC<{ data: GuideItemProps }> = ({ data }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 간단한 피드백 (브라우저가 지원할 때)
      // toast나 알림 컴포넌트가 있으면 그걸 호출하도록 바꿔도 좋음
      alert("복사되었습니다.");
    } catch {
      alert("복사 실패 (클립보드 접근 권한 필요).");
    }
  };

  return (
    <article className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 scroll-mt-24">
      <header className="flex items-start justify-between gap-4 pb-6 border-b border-slate-700">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">{data.title}</h2>
          <div className="flex items-center gap-3">
            <Badge color="bg-cyan-600">{data.category}</Badge>
            <div className="flex items-center gap-1 bg-slate-700/50 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-xs font-semibold text-white mr-1">
                중요도
              </span>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="text-lg">
                  {i < (data.severity as number) ? "🔴" : "⚪"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(data.checkSteps)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          title="점검 기준 복사"
        >
          📋 복사
        </button>
      </header>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-700/50 p-5 rounded-2xl shadow-md border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              📝 항목 상세 내용
            </h3>
            <p className="text-white leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>

          <div className="bg-slate-700/50 p-5 rounded-2xl shadow-md border border-slate-600">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
              ⚠️ 어떤 일이 벌어질까?
            </h3>
            <p className="text-white leading-relaxed whitespace-pre-line">
              {data.whatHappens}
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-5 rounded-2xl shadow-md border border-cyan-600/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              ✅ 점검 기준
            </h3>
            <pre className="bg-slate-900/50 p-4 rounded-xl text-sm text-slate-300 whitespace-pre-wrap shadow-sm border border-cyan-600/20">
              {data.checkSteps}
            </pre>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-emerald-900/20 to-green-900/20 rounded-2xl shadow-md border border-emerald-600/30">
            <h4 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
              💡 조치 방안
            </h4>
            <ul className="space-y-2 text-slate-300">
              {data.remediation.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 rounded-2xl shadow-md border border-amber-600/30">
            <h4 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
              ⚡ Side Effect
            </h4>
            <p className="text-slate-300">{data.sideEffect}</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-rose-900/20 to-red-900/20 rounded-2xl shadow-md border border-rose-600/30">
            <h4 className="text-base font-bold text-rose-400 mb-3 flex items-center gap-2">
              🚨 미조치 사례
            </h4>
            <ul className="text-slate-300 space-y-2">
              {data.examples.map((ex, i) => (
                <li key={i} className="text-sm bg-slate-900/30 p-2 rounded-lg">
                  <strong className="text-rose-400">{ex.title}</strong>
                  {ex.date && (
                    <span className="text-slate-400 text-xs"> • {ex.date}</span>
                  )}
                  {ex.note && (
                    <div className="text-slate-400 text-xs mt-1">{ex.note}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </article>
  );
};

export default function GuideDetail() {
  const { service } = useParams<{ service: string }>();
  const [articles, setArticles] = useState<GuideItemProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  const scrollToArticle = (index: number) => {
    const element = document.getElementById(`article-${index}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 flex items-center justify-center">
        <div className="text-white text-xl">
          해당 서비스의 가이드가 준비 중입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="flex gap-8 max-w-7xl mx-auto p-8">
        {/* 왼쪽 목차 - 고정 */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">📑 목차</h3>
            <nav className="space-y-2">
              {filteredArticles.map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => scrollToArticle(index)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-300 hover:text-cyan-400 font-medium"
                >
                  {index + 1}. {article.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 오른쪽 아티클 영역 */}
        <div className="flex-1 space-y-12">
          {/* 카테고리 필터 */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {filteredArticles.map((article, index) => (
            <div key={article.id} id={`article-${index}`}>
              <GuideItem data={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
