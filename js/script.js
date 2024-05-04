console.log("Hello js")

$(document).ready(function(){

    async function callOpenAiApiFunc(argGptPrompt) {

        const url='http://localhost:8080/callOpenAiApi';
        const data = {
            gptPrompt: argGptPrompt
        };

        try {
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = await response.json();
                document.getElementById("resGpt").innerHTML = responseData.responseText;
                if (responseData.imageUrl) {
                    document.getElementById("resImg").src = responseData.imageUrl;
                }
            } else {
                console.log("Response Error: "+ response.error)
            }
        } catch(error){
            console.error('Error Call Gpt Func:' + error);
        }
    }

    $("#btnGpt").click(function(){
        var gptPrompt = $("#gptPrompt").val();
        callOpenAiApiFunc(gptPrompt);
    });

});