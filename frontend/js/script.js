document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const currentCharCount = document.getElementById('currentCharCount');
    const targetRadios = document.querySelectorAll('input[name="target"]');
    const convertButton = document.getElementById('convertButton');
    const outputText = document.getElementById('outputText');
    const copyButton = document.getElementById('copyButton');
    const MAX_CHARS = 500;

    // --- FR-04: 입력 편의성 (글자 수 실시간 확인) ---
    inputText.addEventListener('input', () => {
        const currentLength = inputText.value.length;
        currentCharCount.textContent = currentLength;
        if (currentLength > MAX_CHARS) {
            inputText.value = inputText.value.substring(0, MAX_CHARS);
            currentCharCount.textContent = MAX_CHARS;
        }
    });

    // --- FR-01: 핵심 말투 변환 & FR-05: 오류 처리 (변환 버튼 클릭 시) ---
    convertButton.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) {
            alert('변환할 텍스트를 입력해주세요.');
            return;
        }

        const selectedTarget = Array.from(targetRadios).find(radio => radio.checked).value;

        // Disable buttons during API call
        convertButton.disabled = true;
        copyButton.disabled = true;
        convertButton.textContent = '변환 중...';

        try {
            // Placeholder for API call
            // 백엔드 API와의 비동기 통신 로직 구현 (Fetch 함수사용)
            const response = await fetch('/api/convert', { // This endpoint needs to be created in app.py
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, target: selectedTarget }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '알 수 없는 오류가 발생했습니다.');
            }

            const data = await response.json();
            console.log(data); // Log the full response data for debugging
            outputText.value = data.converted_text; // Corrected to snake_case
 // FR-02: 결과 비교 및 확인 (결과 표시)
        } catch (error) {
            console.error('Error:', error);
            outputText.value = `오류가 발생했습니다: ${error.message}. 잠시 후 다시 시도해주세요.`; // FR-05: 오류 처리
        } finally {
            // Re-enable buttons
            convertButton.disabled = false;
            copyButton.disabled = false;
            convertButton.textContent = '변환하기';
        }
    });

    // --- FR-03: 결과 활용 (복사하기 버튼 클릭 시) ---
    copyButton.addEventListener('click', () => {
        if (outputText.value) {
            navigator.clipboard.writeText(outputText.value).then(() => {
                // FR-03: 복사 성공 시 시각적 피드백
                const originalText = copyButton.textContent;
                copyButton.textContent = '복사되었습니다!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('텍스트 복사에 실패했습니다.');
            });
        }
    });
});
