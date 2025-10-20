export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* 슬로건 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-beige to-primary-light bg-clip-text text-transparent leading-tight">
            실제 침해사례 기반의 보안점검으로,
            <br />
            인프라를 안전하게 관리합니다.
          </h1>
          <p className="text-xl md:text-2xl text-primary-light max-w-4xl mx-auto leading-relaxed">
            ISMS-P 인증을 받았더라도 침해사고는 이어지고 있습니다.
            <br />
            Clouddoctor는 인증의 한계를 보완하는 실효성 중심 보안 점검을
            제공합니다.
          </p>
        </div>

        {/* 내용 */}
        <div className="bg-primary-dark/50 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-16 border border-primary">
          <p className="text-lg text-beige leading-relaxed">
            실제 AWS 침해사고와 공격 기법을 바탕으로 만든 현실적인 보안
            가이드라인과 체크리스트, 웹사이트 내 자동점검을 제공합니다.
            보안전문가가 아니여도 최소한의 보안을 지킬 수 있도록 구체적인 점검
            방법과 즉시 적용 가능한 조치안을 안내합니다.
          </p>
        </div>

        {/* 핵심 가치 포인트 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-primary-dark/50 backdrop-blur-xl rounded-2xl p-8 border border-primary hover:border-accent transition-all">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-beige mb-4">
              사고 기반 체크리스트
            </h3>
            <p className="text-primary-light leading-relaxed">
              실제 침해사례를 반영한 우선순위 점검
            </p>
          </div>

          <div className="bg-primary-dark/50 backdrop-blur-xl rounded-2xl p-8 border border-primary hover:border-accent transition-all">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-beige mb-4">
              구체적 How-to
            </h3>
            <p className="text-primary-light leading-relaxed">
              콘솔 경로, 명령어, 위험 기준/양호 기준까지
            </p>
          </div>

          <div className="bg-primary-dark/50 backdrop-blur-xl rounded-2xl p-8 border border-primary hover:border-accent transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-beige mb-4">자동 점검</h3>
            <p className="text-primary-light leading-relaxed">
              클릭 한 번으로 주요 보안 항목을 즉시 분석
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-accent rounded-3xl p-12 shadow-2xl">
          <p className="text-2xl text-white mb-8 leading-relaxed">
            Clouddoctor와 함께 최소한의 보안 체계를 빠르게 구축하고,
            <br />
            실제 공격에 강한 운영 상태를 만들 수 있습니다.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/guide"
              className="px-8 py-4 bg-beige text-primary-dark rounded-xl font-bold text-lg hover:bg-primary-light transition-all shadow-lg"
            >
              가이드 보기
            </a>
            <a
              href="/checklist"
              className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all shadow-lg border-2 border-white/50"
            >
              체크리스트 시작
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
