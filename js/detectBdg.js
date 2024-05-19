$(document).ready(function () {
  /**
   * Initial process
   */
  function initialize() {
    $("#loading").css("display", "none");

    // Add 'loaded' class to body assuming all css is loaded
    $("body").removeClass("lazyload");
    $("body").addClass("loaded");

    // Screen display after applying css(countermeasure for delay in image loading speed)
    $("img.lazyload").each(function () {
      if (this.complete) {
        $(this).addClass("loaded");
      } else {
        $(this).on("load", function () {
          $(this).addClass("loaded");
        });
      }
    });

    displaySearchArea("show");
    displayResultArea("hide");
  }

  /**
   * Exec chatgpt action
   * @param {*} argsBdgNm
   * @returns responseText
   */
  async function getBdgInfo(argsBdgNm) {
    const TIMEOUT = 20000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("リクエストがタイムアウトしました")),
        TIMEOUT
      )
    );

    const url =
      "https://gp8gumd4lb.execute-api.ap-northeast-1.amazonaws.com/first";

    args = {
      argsBdgNm: argsBdgNm,
    };

    const fetchPromise = fetch(url, {
      method: "POST",
      body: JSON.stringify(args),
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      if (!response.ok) {
        throw new Error(
          "Exception : Incorrect network response, gpt response error"
        );
      }
      const data = await response.json();
      return data.body;
    } catch (e) {
      alert("ChatGPTへの接続が失敗もしくはタイムアウトしました。");
    }
  }

  /**
   * Search button click event
   * @returns void
   */
  async function searchButtonClick() {
    const argsBdgNm = $("#inputText").val();
    if (argsBdgNm === "") {
      alert("ボードゲームを入力してください。");
      return;
    } else {
      $("#loading").css("display", "flex");

      // Exec bdg name
      const responseText = await getBdgInfo(argsBdgNm);

      if (responseText === undefined || responseText.length == 0) {
        displaySearchArea("show");
        displayResultArea("hide");
      } else {
        // Set the response
        displaySearchArea("hide");
        displayResultArea("show");
        $("#requestBdgNm").text(argsBdgNm);
        $("#gptAnswer1").text(responseText[0]);
        $("#gptAnswer2").html(responseText[1].replace(/\n/g, "<br>"));
      }
      $("#loading").css("display", "none");
    }
  }

  function displaySearchArea(hideOrShow) {
    if (hideOrShow == "show") {
      $("#searchArea").show();
    } else {
      $("#searchArea").hide();
    }
  }

  function displayResultArea(hideOrShow) {
    if (hideOrShow == "show") {
      $("#resultArea").show();
    } else {
      $("#resultArea").hide();
    }
  }

  // Not showing loading display when click back button(for without iPhone)
  window.addEventListener("popstate", function (event) {
    $("#loading").css("display", "none");
  });

  // Not showing loading display when click back button(for iPhone)
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      // When the cache is enabled
      window.location.reload();
    }
  });

  // Search Button Click Action
  $("#searchBdgByText").on("click", searchButtonClick);

  initialize();
});
