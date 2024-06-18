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
   * @param {*} file
   * @returns responseText
   */
  async function getBdgInfoByImage(base64Image) {
    const TIMEOUT = 20000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("リクエストがタイムアウトしました")),
        TIMEOUT
      )
    );
    const url =
      "https://zozb5lj190.execute-api.ap-northeast-1.amazonaws.com/first/";

    const args = {
      inputImage: base64Image,
    };

    const fetchPromise = fetch(url, {
      method: "POST",
      body: JSON.stringify(args),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "bd5BoIUYku1PHoiPKO4yL3seg7wAkWyo2WOCqCr6",
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
      console.log(e);
      alert("ChatGPTへの接続が失敗もしくはタイムアウトしました。");
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

  /**
   * Search button click event
   * @returns void
   */
  async function execGptByCamera(base64Image) {
    $("#loading").css("display", "flex");

    // Exec bdg name
    const responseText = await getBdgInfoByImage(base64Image);

    if (responseText === undefined || responseText.length == 0) {
      displaySearchArea("show");
      displayResultArea("hide");
      // Remove the image if it exists
      if ($("#captureed-image").attr("src")) {
        $("#captureed-image").removeAttr("src");
      }
    } else {
      // Set the response
      displaySearchArea("hide");
      displayResultArea("show");
      $("#requestBdgNm").text(responseText[0]);
      $("#gptAnswer1").text(responseText[1]);
      $("#gptAnswer2").html(responseText[2].replace(/\n/g, "<br>"));
    }
    $("#loading").css("display", "none");
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

  // Camera Button Click Action
  $("#inputImg").on("change", function (e) {
    var file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Base64 image data
        const base64Image = e.target.result.split(",")[1];
        execGptByCamera(base64Image);
        // Display the image
        $("#captureed-image").attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("画像読み込みでエラーが発生しました。");
    }
  });

  initialize();
});
