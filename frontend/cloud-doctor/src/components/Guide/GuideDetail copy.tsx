import React from "react";
import { useState, useEffect } from "react";

const [guidelines, setGuidelines] = useState<GuidedetailProps[]>([]);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("https://back.takustory.site/api/guidelines"); // ✅ API 주소 변경
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

type IncidentRef = {
  title: string;
  date?: string;
  note?: string;
};

type GuidedetailProps = {
  category?: string;
  severity?: number | string;
  title?: string;
  description?: string;
  whatHappens?: string;
  checkSteps?: string;
  remediation?: string[];
  sideEffect?: string;
  examples?: IncidentRef[];
  note?: string;
};

const defaultData: GuidedetailProps = {
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

const Guidedetail: React.FC<{ data?: GuidedetailProps }> = ({
  data = defaultData,
}) => {
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
    <article className="max-w-4xl mx-auto p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            {data.title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge color="bg-indigo-600">{data.category}</Badge>
            <Badge
              color={
                typeof data.severity === "number" && +data.severity <= 2
                  ? "bg-yellow-500"
                  : "bg-red-600"
              }
            >
              중요도 {data.severity}
            </Badge>
          </div>
        </div>

        <div className="text-right text-sm text-slate-600">
          <div className="mb-1">검토 항목</div>
          <button
            onClick={() => copyToClipboard(data.checkSteps || "")}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border"
            title="점검 기준 복사"
          >
            점검 기준 복사
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 12h6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">
            항목 상세 내용
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>

          <h3 className="mt-4 text-sm font-semibold text-slate-600 mb-2">
            어떤 일이 벌어질까?
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {data.whatHappens}
          </p>

          <h3 className="mt-4 text-sm font-semibold text-slate-600 mb-2">
            점검 기준
          </h3>
          <pre className="bg-slate-50 p-3 rounded-md text-sm text-slate-800 whitespace-pre-wrap border">
            {data.checkSteps}
          </pre>
        </div>

        <aside className="space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">
              조치 방안
            </h4>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {data.remediation?.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">
              Side Effect
            </h4>
            <p className="text-slate-700">{data.sideEffect || "없음"}</p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">
              미조치 사례
            </h4>
            <ul className="text-slate-700 space-y-1">
              {data.examples?.map((ex, i) => (
                <li key={i} className="text-sm">
                  <strong>{ex.title}</strong>
                  {ex.date ? (
                    <span className="text-slate-500"> — {ex.date}</span>
                  ) : null}
                  {ex.note ? (
                    <div className="text-slate-500 text-xs">{ex.note}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </article>
  );
};

export default Guidedetail;
