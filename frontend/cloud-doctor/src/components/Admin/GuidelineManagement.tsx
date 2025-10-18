import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { GuidelineDetailModal } from './GuidelineDetailModal';

interface Guideline {
  id: number;
  title: string;
  importanceLevel: string;
  whyDangerous: string;
  whatHappens: string;
  checkCriteria: string;
}

interface GuidelineManagementProps {
  providerId: number;
  providerName: string;
  serviceId: number;
  serviceName: string;
  onBack: () => void;
}

export default function GuidelineManagement({ 
  providerId, 
  providerName, 
  serviceId, 
  serviceName, 
  onBack 
}: GuidelineManagementProps) {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuideline, setSelectedGuideline] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadGuidelines();
  }, [serviceId]);

  const loadGuidelines = async () => {
    try {
      const data = await adminApi.getGuidelines();
      console.log('All guidelines data:', data);
      // serviceId로 필터링 (필요시)
      setGuidelines(data);
    } catch (error) {
      console.error('가이드라인 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGuidelineById = async (id: number) => {
    try {
      const guideline = await adminApi.getGuideline(id);
      console.log('Selected guideline:', guideline);
      
      // 데이터 구조 변환 - 백엔드 응답에 맞게 수정
      const convertedGuideline = {
        id: guideline.id.toString(),
        title: guideline.title || '',
        serviceId: guideline.serviceListId?.toString() || '',
        serviceName: serviceName,
        priority: guideline.importanceLevel === '긴급' ? 'urgent' : 
                 guideline.importanceLevel === '중요' ? 'important' : 
                 guideline.importanceLevel === 'urgent' ? 'urgent' :
                 guideline.importanceLevel === 'important' ? 'important' : 'confirm',
        content: {
          whyDangerous: guideline.whyDangerous || '',
          whatHappens: guideline.whatHappens || '',
          checkCriteria: guideline.checkStandard || '',
          sideEffect: guideline.sideEffects || '',
          checkImages: []
        },
        uncheckedCases: (guideline.links || []).map(link => 
          typeof link === 'string' ? {title: '', url: link} : link
        ),
        note1: guideline.note || '',
        note2: '',
        createdAt: guideline.createdAt || new Date().toISOString()
      };
      
      setSelectedGuideline(convertedGuideline);
      setIsModalOpen(true);
    } catch (error) {
      console.error('가이드라인 상세 조회 실패:', error);
    }
  };

  const updateGuideline = async (id: string, data: any) => {
    try {
      const updateData = {
        title: data.title || '',
        cloudProviderId: providerId,
        serviceListId: serviceId,
        importanceLevel: data.priority || 'confirm',
        whyDangerous: data.content?.whyDangerous || '',
        whatHappens: data.content?.whatHappens || '',
        checkStandard: data.content?.checkCriteria || '',
        solutionText: data.content?.solutionText || '',
        sideEffects: data.content?.sideEffect || '',
        note: data.note1 || '',
        links: data.links || []
      };
      
      console.log('Update data:', updateData); // 디버깅용
      await adminApi.updateGuideline(Number(id), updateData);
      await loadGuidelines();
      setIsModalOpen(false);
      setSelectedGuideline(null);
    } catch (error) {
      console.error('가이드라인 수정 실패:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGuideline(null);
  };
  const [formData, setFormData] = useState({
    title: '',
    importanceLevel: '확인요망',
    whyDangerous: '',
    whatHappens: '',
    checkStandard: '',
    solutionText: '',
    sideEffects: '',
    note: ''
  });
  const [links, setLinks] = useState(['']);



  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, value: string) => {
    const updatedLinks = links.map((link, i) => 
      i === index ? value : link
    );
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createGuideline({
        ...formData,
        cloudProviderId: providerId,
        serviceListId: serviceId,
        links: links.filter(link => link.trim() !== '')
      });
      
      setFormData({
        title: '',
        importanceLevel: '확인요망',
        whyDangerous: '',
        whatHappens: '',
        checkStandard: '',
        solutionText: '',
        sideEffects: '',
        note: ''
      });
      setLinks(['']);
      setShowForm(false);
      await loadGuidelines();
      alert('가이드라인이 추가되었습니다.');
    } catch (error: any) {
      console.error('가이드라인 추가 실패:', error);
      alert(error.response?.data?.message || '가이드라인 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (guidelineId: number, title: string) => {
    if (!window.confirm(`'${title}' 가이드라인을 삭제하시겠습니까?`)) return;

    try {
      await adminApi.deleteGuideline(guidelineId.toString());
      await loadGuidelines();
      alert('가이드라인이 삭제되었습니다.');
    } catch (error: any) {
      console.error('가이드라인 삭제 실패:', error);
      alert(error.response?.data?.message || '가이드라인 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← 뒤로가기
        </button>
        <h1 className="text-3xl font-bold">{providerName} - {serviceName} 가이드라인</h1>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          {showForm ? '폼 닫기' : '새 가이드라인 추가'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">새 가이드라인 추가</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">중요도</label>
              <select
                value={formData.importanceLevel}
                onChange={(e) => setFormData({...formData, importanceLevel: e.target.value})}
                className="w-full p-3 border rounded-md"
              >
                <option value="확인요망">확인요망</option>
                <option value="중요">중요</option>
                <option value="긴급">긴급</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">왜 위험한가?</label>
              <textarea
                value={formData.whyDangerous}
                onChange={(e) => setFormData({...formData, whyDangerous: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">어떤 일이 발생하는가?</label>
              <textarea
                value={formData.whatHappens}
                onChange={(e) => setFormData({...formData, whatHappens: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">점검 기준</label>
              <textarea
                value={formData.checkStandard}
                onChange={(e) => setFormData({...formData, checkStandard: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">조치 방안</label>
              <textarea
                value={formData.solutionText}
                onChange={(e) => setFormData({...formData, solutionText: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">부작용</label>
              <textarea
                value={formData.sideEffects}
                onChange={(e) => setFormData({...formData, sideEffects: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">비고</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full p-3 border rounded-md h-24"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">참고 링크</label>
                <button
                  type="button"
                  onClick={addLink}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  링크 추가
                </button>
              </div>
              {links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
              >
                가이드라인 추가
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">가이드라인 목록</h2>
        
        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : guidelines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">등록된 가이드라인이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {guidelines.map((guideline) => (
              <div 
                key={guideline.id} 
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => getGuidelineById(guideline.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">{guideline.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      guideline.importanceLevel === '긴급' || guideline.importanceLevel === 'urgent' ? 'bg-red-100 text-red-800' :
                      guideline.importanceLevel === '중요' || guideline.importanceLevel === 'important' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {guideline.importanceLevel === '긴급' || guideline.importanceLevel === 'urgent' ? '긴급' : 
                       guideline.importanceLevel === '중요' || guideline.importanceLevel === 'important' ? '중요' : '확인요망'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(guideline.id, guideline.title);
                      }}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>위험성:</strong> {guideline.whyDangerous}</p>
                  <p><strong>발생 가능한 문제:</strong> {guideline.whatHappens}</p>
                  <p><strong>점검 기준:</strong> {guideline.checkStandard}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <GuidelineDetailModal
        guideline={selectedGuideline}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpdate={updateGuideline}
      />
    </div>
  );
}