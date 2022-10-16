(function (window, document) {
  "use strict";
  var original_data;
  var data_storage;
  var data_bio;
  var last_key = 0;
  var current_position = 0;
  var env_urls = skGetEnvironmentUrls("instagram-reels");
  var app_url = env_urls.app_url;
  var app_backend_url = env_urls.app_backend_url;
  var app_file_server_url = env_urls.app_file_server_url;
  var sk_app_url = env_urls.sk_app_url;
  var sk_api_url = env_urls.sk_api_url;
  var el = document.getElementsByClassName("sk-ww-instagram-reels")[0];
  if (el == undefined) {
    var el = document.getElementsByClassName("dsm-instagram-reels")[0];
    el.className = "sk-ww-instagram-reels";
  }
  var embed_id = document
    .getElementsByClassName("sk-ww-instagram-reels")[0]
    .getAttribute("data-embed-id");
  el.innerHTML =
    "<div class='first_loading_animation' style='text-align:center; width:100%;'><img src='" +
    app_url +
    "images/ripple.svg' class='loading-img' style='width:auto !important; float:none !important; text-align:center !important; border:none !important;' /></div>";
  loadCssFile(app_url + "libs/js/swiper/swiper.min.css");
  loadCssFile(app_url + "libs/js/swiper/swiper.css");
  loadCssFile(app_url + "libs/js/magnific-popup/magnific-popup.css");
  loadCssFile(
    app_url + "instagram-reels/widget_css.php?v=" + new Date().getTime()
  );
  loadCssFile(
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
  );
  function loadCssFile(filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (typeof fileref != "undefined") {
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
  }
  if (window.jQuery === undefined) {
    var script_tag = document.createElement("script");
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute(
      "src",
      "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"
    );
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        if (this.readyState == "complete" || this.readyState == "loaded") {
          scriptLoadHandler();
        }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    (
      document.getElementsByTagName("head")[0] || document.documentElement
    ).appendChild(script_tag);
  } else {
    jQuery = window.jQuery;
    scriptLoadHandler();
  }
  function loadSliderJs() {
    var script = document.createElement("SCRIPT");
    script.setAttribute("src", app_url + "libs/js/swiper/swiper.min.js");
    script.setAttribute("type", "text/javascript");
    script.onload = function () {
      main();
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  function loadScript(url, callback) {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    if (typeof callback !== "undefined") {
      if (scriptTag.readyState) {
        scriptTag.onreadystatechange = function () {
          if (this.readyState === "complete" || this.readyState === "loaded") {
            callback();
          }
        };
      } else {
        scriptTag.onload = callback;
      }
    }
    (
      document.getElementsByTagName("head")[0] || document.documentElement
    ).appendChild(scriptTag);
  }
  function scriptLoadHandler() {
    loadScript(
      app_url + "libs/js/magnific-popup/jquery.magnific-popup.js",
      function () {
        $ = jQuery = window.jQuery.noConflict(true);
        initManificPopupPlugin(jQuery);
        initManificPopupPlugin(jQuery);
        loadSliderJs();
      }
    );
  }
  function abbreviateNumber(number) {
    var decimal_places = Math.pow(10, 1);
    var abreviation = ["K", "M", "B"];
    for (var i = abreviation.length - 1; i >= 0; i--) {
      var size = Math.pow(10, (i + 1) * 3);
      if (size <= number) {
        var number =
          Math.round((number * decimal_places) / size) / decimal_places;
        if (number == 1000 && i < abreviation.length - 1) {
          number = 1;
          i++;
        }
        number += abreviation[i];
        break;
      }
    }
    return number;
  }
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  function getDsmEmbedId(sk_instagram_reels) {
    var embed_id = sk_instagram_reels.attr("embed-id");
    if (embed_id == undefined) {
      embed_id = sk_instagram_reels.attr("data-embed-id");
    }
    return embed_id;
  }
  function getDsmSetting(sk_instagram_reels, key) {
    return sk_instagram_reels.find("." + key).text();
  }
  function replaceContentWithLinks(html) {
    if (html.hasClass("linked")) {
      return;
    }
    html.addClass("linked");
    var text = html.html();
    if (text) {
      text = text.replace(/(\r\n|\n\r|\r|\n)/g, " <br> ");
      text = text.replace("#", " #");
      text = text.replace("@", " @");
      var splitted_text = text.split(" ");
      if (splitted_text && splitted_text.length > 0) {
        jQuery.each(splitted_text, function (key, value) {
          if (value.charAt(0) == "#") {
            var original_text = value.replace("#", "");
            text = text.replace(
              " " + value,
              ' <a target="_blank" href="https://instagram.com/explore/tags/' +
                original_text +
                '">' +
                value +
                "</a>"
            );
          } else if (value.charAt(0) == "@") {
            var original_text = value.replace("@", "");
            if (original_text == "djsammy86") {
              text = text.replace(
                " " + value,
                ' <a target="_blank" href="https://twitter.com/' +
                  original_text +
                  '">' +
                  value +
                  "</a>"
              );
            } else {
              text = text.replace(
                " " + value,
                ' <a target="_blank" href="https://instagram.com/' +
                  original_text +
                  '">' +
                  value +
                  "</a>"
              );
            }
          } else if (
            value.indexOf("www") != -1 &&
            value.indexOf("href") == -1
          ) {
            var original_text = value.replace("@", "");
            text = text.replace(
              " " + value,
              ' <a target="_blank" href="https://' +
                original_text +
                '">' +
                original_text +
                "</a>"
            );
          }
        });
      }
      html.html(text);
    }
  }
  function openLinkTab() {
    var open_link =
      jQuery(".sk-ww-instagram-reels").find(".open_link_in_new_tab").text() == 1
        ? "_blank"
        : "_parent";
    return "_blank";
  }
  function readFreshContent(clicked_element) {
    var code = clicked_element.attr("data-code");
    var data_type = clicked_element.attr("data-type");
    var video_url = clicked_element.attr("video-url");
    if (jQuery(document).width() > 700) {
      var sk_loading_image_height = jQuery(".ig_media").height();
      jQuery(".sk_popup_column").height(sk_loading_image_height);
    }
    if (!code || code == "" || code.length < 1) {
      return 0;
    }
    var sk_instagram_reels = jQuery(".sk-ww-instagram-reels");
    var embed_id = getDsmEmbedId(sk_instagram_reels);
    var feed_item_container = jQuery(".sk-media-post-container-" + code).find(
      ".sk_popup_column_media"
    );
    var read_one_url =
      app_url +
      "embed/instagram-reels/widget_read_one_json.php?code=" +
      code +
      "&embed_id=" +
      embed_id;
    if (feed_item_container.hasClass("data-loaded")) {
      initializeSwiperSingleSLider();
      return;
    }
    if (feed_item_container.find(".swiper-container").length == 0) {
      var thumbnail_src = feed_item_container
        .find(".sk-image-sizer")
        .attr("src");
      var post_items = "<div class='sk_loading_image' style='height:100%;'>";
      if (data_type == "video") {
        if (video_url != "") {
          post_items +=
            "<img src='" +
            thumbnail_src +
            "' class='ig_media sk-img-preloader' style='height:auto;    vertical-align: middle;object-fit: contain;'>";
          post_items +=
            "<p class='sk-loader' style='font-size:90px;'><i data-fa-i2svg='' class='fa fa-spinner fa-pulse' aria-hidden='true'></i></p>";
          post_items +=
            "<video class='ig_media sk-ig-video' style='width:100%; height: 100%; display:none;' controls>";
          post_items += "<source src='" + video_url + "' type='video/mp4'>";
          post_items += "Your browser does not support HTML5 video.";
          post_items += "</video>";
        }
      } else {
        post_items +=
          "<img src='" +
          thumbnail_src +
          "' class='ig_media' style='height:auto;    vertical-align: middle;object-fit: contain;'>";
      }
      post_items += "</div>";
      feed_item_container.find(".sk-image-sizer").hide();
      feed_item_container.html(post_items);
      loadVideo();
    }
    setTimeout(function () {
      initializeSwiperSingleSLider();
    }, 100);
    feed_item_container.addClass("data-loaded");
  }
  function loadVideo() {
    setTimeout(() => {
      jQuery(".sk-loader, .sk-img-preloader").css({ display: "none" });
      jQuery(".sk-ig-video").css({ display: "block" });
    }, 2000);
  }
  function getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    const inner = document.createElement("div");
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
  function moderationTabFeature(
    sk_instagram_reels,
    setting_turnon_preapproval_posts,
    posts
  ) {
    var preapproved_posts = "do_not_show_anything";
    var excluded_posts = "";
    var exclude_users = "";
    if (setting_turnon_preapproval_posts == 1) {
      preapproved_posts = getDsmSetting(
        sk_instagram_reels,
        "preapproved_posts"
      );
    }
    if (getDsmSetting(sk_instagram_reels, "excluded_posts") != "") {
      excluded_posts = getDsmSetting(sk_instagram_reels, "excluded_posts");
    } else if (getDsmSetting(sk_instagram_reels, "exclude_users") != "") {
      exclude_users = getDsmSetting(sk_instagram_reels, "exclude_users");
    }
    var new_posts_list = [];
    for (let item of posts) {
      if (typeof item != "undefined") {
        if (setting_turnon_preapproval_posts == 1) {
          if (preapproved_posts.indexOf(item.code) != -1) {
            new_posts_list.push(item);
          }
        } else {
          if (
            setting_turnon_preapproval_posts == 0 &&
            excluded_posts.indexOf(item.code) != -1
          ) {
          } else if (
            setting_turnon_preapproval_posts == 0 &&
            exclude_users &&
            exclude_users.indexOf(item.owner_id) != -1
          ) {
          } else {
            new_posts_list.push(item);
          }
        }
      }
    }
    return new_posts_list;
  }
  function HashtagFilter(data_storage, hashtag) {
    var new_posts_lists = [];
    hashtag = "#" + hashtag;
    jQuery.each(data_storage, function (index, value) {
      if (
        value.pic_text_raw &&
        value.pic_text_raw.toLowerCase().indexOf(hashtag.toLowerCase()) != -1
      ) {
        new_posts_lists.push(value);
      } else if (value.post_id && value.post_id.indexOf(hashtag) != -1) {
        new_posts_lists.push(value);
      }
    });
    return new_posts_lists;
  }
  function replaceHttpToLink(content) {
    var exp_match =
      /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    var element_content = content.replace(
      exp_match,
      '<a class="href_status_trigger hide-link" target="_blank" href="$1">$1</a>'
    );
    var new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var new_content = element_content.replace(
      new_exp_match,
      '$1<a class="href_status_trigger hide-link" target="_blank" href="http://$2">$2</a>'
    );
    return new_content;
  }
  function loadBioInformation(sk_instagram_reels, data) {
    var show_profile_picture = sk_instagram_reels
      .find(".show_profile_picture")
      .text();
    var show_profile_username = sk_instagram_reels
      .find(".show_profile_username")
      .text();
    var show_profile_follow_button = sk_instagram_reels
      .find(".show_profile_follow_button")
      .text();
    var show_profile_posts_count = sk_instagram_reels
      .find(".show_profile_posts_count")
      .text();
    var show_profile_follower_count = sk_instagram_reels
      .find(".show_profile_follower_count")
      .text();
    var show_profile_following_count = sk_instagram_reels
      .find(".show_profile_following_count")
      .text();
    var show_profile_name = sk_instagram_reels
      .find(".show_profile_name")
      .text();
    var show_profile_description = sk_instagram_reels
      .find(".show_profile_description")
      .text();
    var show_profile_website = sk_instagram_reels
      .find(".show_profile_website")
      .text();
    var posts_text = sk_instagram_reels.find(".posts_text").text();
    var followers_text = sk_instagram_reels.find(".followers_text").text();
    var following_text = sk_instagram_reels.find(".following_text").text();
    var follow_text = sk_instagram_reels.find(".follow_text").text();
    var media_count = data.bio.media ? formatNumber(data.bio.media) : 0;
    media_count = data.bio.posts_count
      ? formatNumber(data.bio.posts_count)
      : media_count;
    var follows_count = data.bio.follows ? formatNumber(data.bio.follows) : 0;
    follows_count = data.bio.following_count
      ? formatNumber(data.bio.following_count)
      : follows_count;
    var followed_by_number = data.bio.followed_by
      ? formatNumber(data.bio.followed_by)
      : 0;
    followed_by_number = data.bio.followers_count
      ? formatNumber(data.bio.followers_count)
      : followed_by_number;
    var post_items = "";
    if (
      show_profile_picture == 0 &&
      show_profile_username == 0 &&
      show_profile_follow_button == 0 &&
      show_profile_posts_count == 0 &&
      show_profile_follower_count == 0 &&
      show_profile_following_count == 0 &&
      show_profile_name == 0 &&
      show_profile_description == 0 &&
      show_profile_website == 0
    ) {
    } else {
      var is_slider_layout = "";
      if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
        is_slider_layout = "sk-slider-layout-info";
      }
      post_items +=
        "<div class='instagram-user-root-container " + is_slider_layout + "'>";
      var width = "style='width:100%;'";
      if (data.bio.profile_pic_url && show_profile_picture == 1) {
        var width = "";
        post_items +=
          "<div class='sk-instagram-profile-pic_container'><div data-image='" +
          data.bio.username +
          "' class='sk-instagram-profile-pic'></div></div>";
      }
      post_items += "<div class='sk-ig-profile-info ' " + width + ">";
      post_items += "<div class='sk_ig_feed_username_follow'>";
      if (show_profile_username == 1) {
        data.bio.username = data.bio.username
          ? data.bio.username
          : getDsmSetting(sk_instagram_reels, "username");
        post_items +=
          "<a class='href_status_trigger' href='https://www.instagram.com/" +
          data.bio.username +
          "/' target='" +
          openLinkTab() +
          "'><p class='sk-ig-profile-usename' style='color:rgb(85, 85, 85);'>@" +
          data.bio.username +
          "</p></a>";
      }
      post_items += "</div>";
      if (
        (media_count != 0 && show_profile_posts_count == 1) ||
        (followed_by_number != 0 && show_profile_follower_count == 1) ||
        (follows_count != 0 && show_profile_following_count == 1)
      ) {
        post_items += "<div class='sk-ig-profile-counts'>";
        if (media_count != 0 && show_profile_posts_count == 1) {
          post_items +=
            "<span class='sk-ig-profile-count-item' title='" +
            media_count +
            "'><span class='f-w-b'>" +
            media_count +
            "</span> " +
            posts_text +
            "</span>";
        }
        if (followed_by_number != 0 && show_profile_follower_count == 1) {
          post_items +=
            "<span class='sk-ig-profile-count-item' title='" +
            followed_by_number +
            "'><span class='f-w-b'>" +
            followed_by_number +
            "</span> " +
            followers_text +
            "</span>";
        }
        if (follows_count != 0 && show_profile_following_count == 1) {
          post_items +=
            "<span class='sk-ig-profile-count-item' title='" +
            follows_count +
            "'><span class='f-w-b'>" +
            follows_count +
            "</span> " +
            following_text +
            "</span>";
        }
        post_items += "</div>";
      }
      if (
        show_profile_name == 1 ||
        show_profile_description == 1 ||
        show_profile_website == 1 ||
        show_profile_follow_button == 1
      ) {
        post_items +=
          "<div class='href_status_trigger_container bio-description'>";
        post_items += "<div class='sk-ig-profile-bio-container'>";
        if (show_profile_name == 1 && data.bio.full_name) {
          post_items += "<strong>" + data.bio.full_name + "</strong>";
        }
        if (show_profile_description == 1 && data.bio.biography) {
          post_items +=
            "<b> &bull;</b> <span class='sk-ig-profile-bio'>" +
            data.bio.biography +
            "</span>";
        }
        post_items += "</div>";
        if (show_profile_website == 1 && data.bio.website_link) {
          post_items +=
            "<div><a class='bio-website' href='" +
            data.bio.website_link +
            "' target='" +
            openLinkTab() +
            "'>" +
            data.bio.website +
            "</a></div>";
        } else if (show_profile_website == 1 && data.bio.external_url) {
          post_items +=
            "<div><a class='bio-website' href='" +
            data.bio.external_url +
            "' target='" +
            openLinkTab() +
            "'>" +
            data.bio.external_url +
            "</a></div>";
        }
        if (show_profile_follow_button == 1) {
          post_items +=
            "<button type='button' onclick=\"window.open('https://www.instagram.com/" +
            data.bio.username +
            "/');\" class='instagram-user-container'>";
          post_items +=
            "<i data-fa-i2svg='' class='fa fa-instagram' aria-hidden='true'></i> " +
            follow_text;
          post_items += "</button>";
        }
        post_items += "</div>";
      }
      post_items += "</div>";
      post_items += "</div>";
    }
    return post_items;
  }
  function loadFeed(sk_instagram_reels) {
    var embed_id = getDsmEmbedId(sk_instagram_reels);
    var json_url =
      app_file_server_url +
      "" +
      embed_id +
      ".json?nocache=" +
      new Date().getTime();
    var show_load_more_button = sk_instagram_reels
      .find(".show_load_more_button")
      .text();
    var show_bottom_follow_button = sk_instagram_reels
      .find(".show_bottom_follow_button")
      .text();
    var follow_text = sk_instagram_reels.find(".follow_text").text();
    var load_more_posts_text = sk_instagram_reels
      .find(".load_more_posts_text")
      .text();
    var view_on_instagram_text = sk_instagram_reels
      .find(".view_on_instagram_text")
      .text();
    var turnon_preapproval_posts = getDsmSetting(
      sk_instagram_reels,
      "turnon_preapproval_posts"
    );
    var predefined_search_keyword = getDsmSetting(
      sk_instagram_reels,
      "predefined_search_keyword"
    );
    var username = getDsmSetting(sk_instagram_reels, "username");
    var instagram_link = "https://www.instagram.com/" + username + "/";
    var data = original_data;
    if (data.user_info && data.user_info.show_feed == false) {
      sk_instagram_reels.prepend(data.user_info.message);
      sk_instagram_reels.find(".loading-img").hide();
      sk_instagram_reels.find(".first_loading_animation").hide();
      sk_instagram_reels.find(".sk_fb_events_options").hide();
    } else if (data.success == false) {
      sk_instagram_reels.prepend(data.message);
      sk_instagram_reels.find(".loading-img").hide();
      sk_instagram_reels.find(".first_loading_animation").hide();
    } else if (!data.bio && !data.posts) {
      generateSolutionMessage(sk_instagram_reels, embed_id);
    } else {
      var post_items = "";
      data_bio = data.bio;
      post_items += loadBioInformation(sk_instagram_reels, data);
      data_storage = data.posts;
      data_storage = moderationTabFeature(
        sk_instagram_reels,
        turnon_preapproval_posts,
        data_storage
      );
      if (predefined_search_keyword != "") {
        data_storage = HashtagFilter(data_storage, predefined_search_keyword);
      }
      if (data.posts && data.posts.length == 0) {
        post_items += "<div class='sk-no-item-found'>No posts yet.</div>";
      } else if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
        last_key = data_storage.length;
        post_items += loadSliderLayout(sk_instagram_reels, data);
      } else {
        var sk_post_count = 1;
        var sk_hide_item = "";
        post_items += "<div class='sk-ig-all-posts'>";
        var enable_button = false;
        last_key = parseInt(getDsmSetting(sk_instagram_reels, "post_count"));
        for (var i = 0; i < last_key; i++) {
          if (typeof data_storage[i] != "undefined") {
            post_items += getFeedItem(data_storage[i], sk_instagram_reels, "");
          }
        }
        if (data_storage.length > last_key) {
          enable_button = true;
        }
        post_items += "</div>";
        if (enable_button && show_load_more_button == 1) {
          post_items += "<div class='sk-ig-bottom-btn-container'>";
          post_items +=
            "<button type='button' class='sk-ig-load-more-posts'>" +
            load_more_posts_text +
            "</button>";
          post_items += "</div>";
        }
      }
      post_items += skGetBranding(sk_instagram_reels, data.user_info);
      sk_instagram_reels.append(post_items);
      var length_key = last_key;
      if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
        data_storage = data.posts;
        length_key = data_storage.length;
        skLayoutSliderSetting(sk_instagram_reels);
        applyCustomUi(jQuery, sk_instagram_reels);
      }
      for (var i = 0; i < length_key; i++) {
        if (data_storage[i] && typeof data_storage[i] != "undefined") {
          readImageUrl(
            sk_instagram_reels,
            data_storage[i].full_pic_src,
            data_storage[i].code,
            i,
            "instagram-reels/" + embed_id
          );
        }
      }
    }
    if (data.bio && data.bio.profile_pic_url) {
      data_bio = data.bio;
      readImageUrl(
        sk_instagram_reels,
        data.bio.profile_pic_url_hd,
        data.bio.username,
        0
      );
    }
    replaceContentWithLinks(jQuery(".sk-ig-profile-bio"));
    applyCustomUi(jQuery, sk_instagram_reels);
    sk_increaseView(data.user_info);
  }
  function removeTvCodeTemp(code) {
    code = code.replace("https:/www.instagram.com/tv/", "");
    code = code.replace("https:/www.instagram.com/tv/", "");
    code = code.replace("/", "");
    return code;
  }
  function getFeedItem(val, sk_instagram_reels, data_position) {
    val.code = removeTvCodeTemp(val.code);
    var view_on_instagram_text = getDsmSetting(
      sk_instagram_reels,
      "view_on_instagram_text"
    );
    var character_limit = getDsmSetting(sk_instagram_reels, "character_limit");
    var show_icons = getDsmSetting(sk_instagram_reels, "show_icons");
    var links_clickable = getDsmSetting(sk_instagram_reels, "links_clickable");
    var follow_text = sk_instagram_reels.find(".follow_text").text();
    var profile_pic_url =
      app_file_server_url.replace("feed/", "") +
      "images/" +
      original_data.bio.username +
      ".jpg";
    var post_items = "";
    var post_title_hover = "";
    if (
      getDsmSetting(sk_instagram_reels, "show_post_hover_title") &&
      val.pic_text
    ) {
      post_title_hover = 'title="' + val.pic_text + '"';
    }
    post_items +=
      "<div class='sk-ww-instagram-reels-item ' " +
      post_title_hover +
      " data-link='" +
      val.link +
      "' data-type='" +
      val.pic_type +
      "' video-url='" +
      val.video_url +
      "'  data-position='" +
      data_position +
      "'>";
    if (val.pic_type == "video") {
      post_items +=
        "<div class='sk-play-btn'><i data-fa-i2svg='' class='fa fa-play-circle' aria-hidden='true'></i></div>";
    } else if (val.pic_type == "carousel") {
      post_items +=
        "<div class='sk-play-btn'><i data-fa-i2svg='' class='fa fa fa-files-o' aria-hidden='true' style='font-size:20px; line-height:28px;'></i></div>";
    }
    post_items += "<div class='sk-ig-post-hover display-none'>";
    if (val.likes > 0) {
      post_items += "<span class='m-r-15px'>";
      post_items +=
        "<i data-fa-i2svg='' class='fa fa-heart' aria-hidden='true'></i> " +
        abbreviateNumber(val.likes);
      post_items += "</span>";
    }
    if (val.comments > 0) {
      post_items += "<span>";
      post_items +=
        "<i data-fa-i2svg='' class='fa fa-comment' aria-hidden='true'></i> " +
        abbreviateNumber(val.comments);
      post_items += "</span>";
    }
    post_items += "</div>";
    if (val.video_view_count) {
      post_items +=
        "<div class='sk-play-count-container'><i data-fa-i2svg='' class='fa fa-play' aria-hidden='true'></i> <span>" +
        val.video_view_count +
        "</span></div>";
    }
    post_items +=
      "<div data-image='" +
      val.code +
      "' style='background-size:cover; background-position:center; background-image : url(" +
      val.full_pic_src +
      ");' class='sk-ig-post-img'></div>";
    if (getDsmSetting(sk_instagram_reels, "post_item_type") == 1) {
      post_items += "<div style='padding:5px;background-color:#fff;'>";
      if (parseInt(val.pic_like_count_formatted) > 0) {
        post_items += "<span class='sk-ig-feed-m-r-15px'>";
        post_items +=
          "<i data-fa-i2svg='' class='fa fa-heart' aria-hidden='true'></i> " +
          val.pic_like_count_formatted;
        post_items += "</span>";
      }
      if (val.ago_value) {
        post_items += "<span class='sk-ig-feed-m-r-15px'>";
        post_items += val.ago_value;
        post_items += "</span>";
      }
      var new_pic_text = val.pic_text ? val.pic_text : "";
      if (new_pic_text && new_pic_text.length > 30) {
        new_pic_text = new_pic_text.substring(0, 30) + "<a>... more</a>";
      }
      post_items += "<div class='sk-ig-caption'>";
      if (original_data.bio.username) {
        post_items += "<span class='href_status_trigger_container'>";
        post_items +=
          "<label class='sk-ig-informative-username'>" +
          original_data.bio.username +
          " </label>";
        post_items += "</span>";
      }
      if (new_pic_text) {
        post_items +=
          "<span class='href_status_trigger_container sk-ig-feed-m-t-10px sk-ig-pic-text sk-ig-text-" +
          val.code +
          "'>";
        post_items += new_pic_text;
        post_items += "</span>";
      }
      post_items += "</div>";
      post_items += "</div>";
    }
    post_items +=
      "<div class='white-popup mfp-hide sk-pop-ig-post' data-type=" +
      val.pic_type +
      ' data-code="' +
      val.code +
      '">';
    post_items += "<div style='width:100%;'>";
    post_items +=
      "<div class='sk_popup_row sk-media-post-container-" + val.code + "'>";
    post_items +=
      "<div class='sk_popup_column sk_popup_column_media' data-image = '" +
      val.code +
      "'>";
    post_items +=
      "<a data-toggle='tooltip' data-placement='top' title='View on Instagram' class='sk-play-btn sk-play-btn-popup' target='_blank' href='https://www.instagram.com/reel/" +
      val.code +
      "'><i data-fa-i2svg='' class='fa fa fa-play-circle' aria-hidden='true'></i></a>";
    if (val.pic_type != "picture") {
    }
    if (val.pic_type == "video" && val.video_url && val.video_url.length > 0) {
      post_items +=
        "<div class='swiper-slide'><video src='" +
        val.video_url +
        "' class='ig_media' controls></video></div>";
    } else if (
      val.pic_type == "carousel" &&
      val.children &&
      val.children.length > 0
    ) {
      post_items += '<div class="swiper-container swiper-container-single" >';
      post_items += '<div class="swiper-wrapper sk_loading_carousel">';
      val.children.forEach(function (element) {
        if (element.media_type == "IMAGE") {
          post_items +=
            "<div class='swiper-slide'><img src='" +
            element.media_url +
            "' class='ig_media'/></div>";
        }
        if (element.media_type == "VIDEO") {
          post_items +=
            "<div class='swiper-slide'><video src='" +
            element.media_url +
            "' class='ig_media' controls></video></div>";
        }
      });
      post_items += "</div>";
      post_items += '<div class="swiper-pagination"></div>';
      post_items += "<a href='#' class='swiper-button-next-single'>";
      post_items +=
        "<i class='mfp-arrow mfp-arrow-right' aria-hidden='true'></i>";
      post_items += "</a>";
      post_items += "<a href='#' class='swiper-button-prev-single'>";
      post_items +=
        "<i class='mfp-arrow mfp-arrow-left' aria-hidden='true'></i>";
      post_items += "</a>";
      post_items += "</div>";
    } else {
      post_items +=
        "<img src='" + val.pic_src + "' class='ig_media sk-image-sizer' />";
    }
    post_items += "</div>";
    post_items += "<div class='sk_popup_column' >";
    post_items += "<div class='sk_popup_column_spacer'>";
    var sk_popup_column_body_height = 90;
    sk_popup_column_body_height = 100;
    post_items += "<div class='sk_popup_column_user'>";
    post_items +=
      "<img class='sk-popup-profile-image' src='" + profile_pic_url + "' />";
    post_items += "<p>";
    post_items +=
      "<a class='href_status_trigger sk-ww-instagram-reels-username' href='https://www.instagram.com/" +
      original_data.bio.username +
      "/' target='" +
      openLinkTab() +
      "'><span><b>" +
      original_data.bio.username +
      "</b></span></a> â€¢ ";
    post_items +=
      "<a class='href_status_trigger sk-ww-instagram-reels-follow-link' href='https://www.instagram.com/" +
      original_data.bio.username +
      "/' target='" +
      openLinkTab() +
      "'>" +
      follow_text +
      "</a><br>";
    post_items +=
      "<span class='sk-original-audio'>" + val.reels_sound_name + "</span>";
    post_items += "</p>";
    post_items += "</div>";
    post_items +=
      "<div class='sk_popup_column_body' style='height:" +
      sk_popup_column_body_height +
      "%;'>";
    if (getDsmSetting(sk_instagram_reels, "show_description") == 1) {
      post_items +=
        "<div class='sk_popup_column_body_content sk_popup_column_body_content_" +
        val.code +
        "'>";
      post_items += val.pic_text == null ? "" : val.pic_text;
      post_items += "</div>";
    }
    post_items += "</div>";
    post_items += "<div class='sk_popup_column_footer'>";
    if (getDsmSetting(sk_instagram_reels, "show_view_on_twitter_link") == 1) {
      post_items +=
        "<a class='href_status_trigger' style='display: inline-table;' target='_blank' href='https://www.instagram.com/p/" +
        val.code +
        "'>";
      post_items += "<i class='line_break'></i>";
      post_items +=
        "<i data-fa-i2svg='' class='fa fa-instagram'></i> " +
        view_on_instagram_text;
      post_items += "</a>";
    }
    post_items += "<div class='sk-ig-reels-footer-icons-container'>";
    post_items += "<span>";
    post_items +=
      "<i data-fa-i2svg='' class='fa fa-heart' aria-hidden='true'></i> <span class='sk-like-count'>" +
      abbreviateNumber(val.likes) +
      "</span>";
    post_items += "</span>";
    post_items += "<span>";
    post_items +=
      "<i data-fa-i2svg='' class='fa fa-comment' aria-hidden='true'></i> <span class='sk-comment-count'>" +
      abbreviateNumber(val.comments) +
      "</span>";
    post_items += "</span>";
    post_items += "<span>";
    post_items +=
      "<i data-fa-i2svg='' class='fa fa-eye' aria-hidden='true'></i> <span class='sk-comment-count'>" +
      val.video_view_count +
      "</span>";
    post_items += "</span>";
    post_items += "<span class='sk-ig-pop-up-icon'>";
    post_items += "</span>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    return post_items;
  }
  function alignSpinner(jQuery, sk_instagram_reels) {
    var hover_width = sk_instagram_reels
      .find(".sk-ww-instagram-reels-item")
      .width();
    sk_instagram_reels
      .find(".sk-ig-post-hover .fa")
      .css({ height: hover_width + "px", "line-height": hover_width + "px" });
  }
  function requestFeedData(sk_instagram_reels) {
    var embed_id = getDsmEmbedId(sk_instagram_reels);
    var json_url =
      app_file_server_url + embed_id + ".json?nocache=" + new Date().getTime();
    jQuery
      .getJSON(json_url, function (data) {
        original_data = data;
        if (data && data.bio && (data.bio.media || data.bio.posts_count)) {
          loadFeed(sk_instagram_reels);
        } else {
          generateSolutionMessage(sk_instagram_reels, embed_id);
        }
      })
      .fail(function (e) {
        generateSolutionMessage(sk_instagram_reels, embed_id);
      });
  }
  function hidePopUp() {
    if (jQuery.magnificPopup) {
      jQuery.magnificPopup.close();
    }
  }
  function showDsmInstagramFeedPopUp(jQuery, content_src, clicked_element) {
    jQuery(".sk_selected_ig_post").removeClass("sk_selected_ig_post");
    clicked_element.addClass("sk_selected_ig_post");
    var sk_instagram_reels = clicked_element.closest(".sk-ww-instagram-reels");
    hidePopUp();
    if (typeof jQuery.magnificPopup === "undefined")
      initManificPopupPlugin(jQuery);
    jQuery.magnificPopup.open({
      items: { src: content_src },
      type: "inline",
      callbacks: {
        open: function () {
          replaceContentWithLinks(
            jQuery(".mfp-content .sk_popup_column_body_content")
          );
          var layout = getDsmSetting(sk_instagram_reels, "layout");
          var post_html = "";
          if (layout == 3 || clicked_element.prev().length > 0) {
            post_html += "<button class='prev_sk_ig_feed_post'>";
            post_html +=
              "<i data-fa-i2svg='' class='fa fa-chevron-left sk_prt_4px' aria-hidden='true'></i>";
            post_html += "</button>";
          }
          if (layout == 3 || clicked_element.next().length > 0) {
            post_html += "<button class='next_sk_ig_feed_post'>";
            post_html +=
              "<i data-fa-i2svg='' class='fa fa-chevron-right sk_plt_4px' aria-hidden='true'></i>";
            post_html += "</button>";
          }
          jQuery(".mfp-content").prepend(post_html);
          var white_popup = jQuery(".mfp-content").find(".white-popup");
          if (white_popup.find(".sk_popup_column").length == 1) {
            white_popup.find(".sk_popup_row").css("display", "block");
            white_popup.find(".sk_popup_row").css("height", "auto");
            white_popup.find(".sk_popup_column").css("width", "100%");
            white_popup.find(".sk_popup_column .fa-spinner").css("top", "45%");
            white_popup
              .find(".sk_popup_column .ig_media")
              .css("height", "auto");
            white_popup.find(".sk_popup_column .ig_media").css("width", "100%");
          } else {
            var window_height = jQuery(window).height();
            white_popup.css("height", window_height - 100 + "px");
            white_popup.find(".ig_media").css("height", window_height + "px");
          }
          setTimeout(function () {
            var media_height = white_popup
              .find(".sk_popup_column_media")
              .height();
            var header_height = white_popup
              .find(".sk_popup_column_user")
              .height();
            var footer_height = white_popup
              .find(".sk_popup_column_footer")
              .height();
            var padding = 60;
            media_height =
              media_height - (header_height + footer_height + padding);
            white_popup
              .find(".sk_popup_column_body")
              .css({ height: media_height + "px" });
            white_popup
              .find(".sk_popup_column_body")
              .mouseover(function () {
                var sk_popup_column_body_height = jQuery(this).height();
                var sk_popup_column_body_content_height = jQuery(this)
                  .find(".sk_popup_column_body_content")
                  .height();
                if (
                  sk_popup_column_body_height <
                  sk_popup_column_body_content_height
                ) {
                  jQuery(this).css({ overflow: "hidden scroll" });
                }
              })
              .mouseout(function () {
                jQuery(this).css({ overflow: "hidden" });
              });
            white_popup
              .find(".sk_popup_column_user span")
              .css({
                "font-size": getDsmSetting(
                  sk_instagram_reels,
                  "details_font_size"
                ),
              });
            white_popup
              .find(".sk_popup_column")
              .css({
                background: getDsmSetting(
                  sk_instagram_reels,
                  "pop_up_bg_color"
                ),
                color: getDsmSetting(sk_instagram_reels, "pop_up_font_color"),
                "font-size": getDsmSetting(
                  sk_instagram_reels,
                  "details_font_size"
                ),
              });
            white_popup
              .find(".sk_popup_column a")
              .css({
                color: getDsmSetting(sk_instagram_reels, "pop_up_link_color"),
              });
            var H = white_popup.find(".sk_popup_column").height();
            white_popup.find(".sk_popup_column .ig_media").height(H);
            initializeSwiperSingleSLider(clicked_element);
            if (
              jQuery(".mfp-content .sk-pop-ig-post video.ig_media").get(0) !==
              undefined
            ) {
              jQuery(".mfp-content .sk-pop-ig-post video.ig_media")
                .get(0)
                .play();
            }
            jQuery(".mfp-content").find(".mfp-close").remove();
            jQuery(".mfp-content").prepend(
              '<button title="Close (Esc)" type="button" class="mfp-close" style="right: 0px;">Ã—</button>'
            );
            jQuery(".mfp-content")
              .find(".white-popup")
              .css({ "margin-top": "25px", "margin-bottom": "25px" });
            jQuery(".mfp-content")
              .find(".mfp-close")
              .css({
                right:
                  parseInt(
                    jQuery(".mfp-content")
                      .find(".white-popup")
                      .css("marginRight")
                  ) -
                  8 +
                  "px",
              });
            if (sk_instagram_reels.width() <= 780) {
              jQuery(".mfp-content").find(".mfp-close").css({ top: "45px" });
            }
            jQuery(".mfp-close, .prev_sk_ig_feed_post, .next_sk_ig_feed_post")
              .mouseover(function () {
                jQuery(this).attr("style", "opacity: 0.3 !important;");
              })
              .mouseout(function () {
                jQuery(this).attr("style", "opacity: 0.8 !important;");
              });
          }, 50);
        },
        close: function () {
          jQuery(".prev_sk_ig_feed_post, .next_sk_ig_feed_post").remove();
          jQuery("video").each(function () {
            $(this)[0].pause();
          });
        },
      },
    });
  }
  function initializeSwiperSingleSLider(clicked_element) {
    var singleSwiper = new Swiper(".swiper-container-single.swiper-container", {
      slidesPerView: 1,
      spaceBetween: 30,
      effect: "fade",
      autoplay: 3000,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next-single",
        prevEl: ".swiper-button-prev-single",
      },
    });
    singleSliderLayout();
    setTimeout(function () {
      singleSliderLayout();
    }, 1000);
    setTimeout(function () {
      singleSliderLayout();
    }, 2000);
    jQuery(".swiper-button-next-single").click(
      { swiper: singleSwiper },
      skSliderSingleNextClickEvent
    );
    jQuery(".swiper-button-prev-single").click(
      { swiper: singleSwiper },
      skSliderSinglePrevClickEvent
    );
    if (
      jQuery(".mfp-content .swiper-slide-active video.carousel-video").get(
        0
      ) !== undefined
    ) {
      jQuery(".mfp-content .swiper-slide-active video.carousel-video")
        .get(0)
        .play();
    }
  }
  function skSliderSingleNextClickEvent() {
    jQuery(".mfp-content .sk_popup_column .ig_media").css("width", "100%");
    jQuery("video").each(function () {
      jQuery(this)[0].pause();
    });
    if (
      jQuery(".mfp-content .swiper-slide-active video.carousel-video").get(
        0
      ) !== undefined
    ) {
      jQuery(".mfp-content .swiper-slide-active video.carousel-video")
        .get(0)
        .play();
    }
  }
  function skSliderSinglePrevClickEvent() {
    jQuery(".mfp-content .sk_popup_column .ig_media").css("width", "100%");
    jQuery("video").each(function () {
      jQuery(this)[0].pause();
    });
    if (
      jQuery(".mfp-content .swiper-slide-active video.carousel-video").get(
        0
      ) !== undefined
    ) {
      jQuery(".mfp-content .swiper-slide-active video.carousel-video")
        .get(0)
        .play();
    }
  }
  function singleSliderLayout() {
    var height = jQuery(
      ".swiper-container-single img,.sk_loading_image img,.sk_loading_video video"
    ).innerHeight();
    if (jQuery(".mfp-content .sk_loading_image").length) {
      height = jQuery(".mfp-content .sk_loading_image").height();
      jQuery(".mfp-content .sk_loading_image img").height(height);
    }
    var type = jQuery(".white-popup").attr("data-type");
    var mfp_content = jQuery(".white-popup");
    var media_container = jQuery(".mfp-content .sk-media-post-pop-up");
    var media_height = media_container.find("img").height();
    if (media_container.find("img").length == 0) {
      media_height = media_container.find("video").height();
    }
    if (type != "picture") {
      media_container.css("height", media_height + "px");
    }
    media_container.css("height", media_height + "px");
    var _h = jQuery(".white-popup").find(".sk_popup_row:first").height();
    if (media_container.find(".swiper-slide-active").length > 0) {
      var height = media_container
        .find(".swiper-slide-active img,.swiper-slide-active video")
        .height();
      var height = _h;
      media_container.css("height", height + "px");
      mfp_content.find(".sk-popup-container").css("height", height + "px");
      mfp_content.find(".sk-media-post-container").css("height", height + "px");
      mfp_content.find(".swiper-container").css("height", height + "px");
      mfp_content.find(".swiper-wrapper").css("height", height + "px");
      mfp_content.find(".swiper-slide").css("height", height + "px");
      mfp_content.find(".sk_loading_image img").css("height", "auto");
    }
  }
  function loadSliderLayout(sk_instagram_reels, data) {
    var column_count = getDsmSetting(sk_instagram_reels, "column_count");
    column_count = parseInt(column_count);
    if (jQuery(document).width() < 480) {
      column_count = 1;
    } else if (jQuery(document).width() < 750) {
      column_count = column_count > 2 ? 2 : column_count;
    }
    var post_items =
      "<div class='sk-slider-container' style='display: block;position: relative;'>";
    post_items +=
      "<button type='button' class='swiper-button-next ' style='pointer-events: all;'>";
    post_items += "<i class='sk-arrow sk-arrow-right'></i>";
    post_items += "</button>";
    post_items +=
      "<button type='button' class='swiper-button-prev' style='pointer-events: all;'>";
    post_items += "<i class='sk-arrow sk-arrow-left'></i>";
    post_items += "</button>";
    post_items += "<div class='swiper-container swiper-layout-slider'>";
    post_items += "<div class='swiper-wrapper'>";
    var data_position = 0;
    var data_slider = data_storage;
    var pages = Math.ceil(data_slider.length / column_count);
    for (var slide = 1; slide <= pages; slide++) {
      post_items += "<div class='swiper-slide' >";
      post_items += "<div class='sk-ig-all-posts'>";
      var slide_data = getPaginationResult(
        sk_instagram_reels,
        data_slider,
        slide,
        column_count
      );
      jQuery.each(slide_data, function (key, val) {
        if (typeof val != "undefined")
          post_items += getFeedItem(val, sk_instagram_reels, data_position);
        data_position++;
      });
      post_items += "</div>";
      post_items += "</div>";
    }
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";
    return post_items;
  }
  function getPaginationResult(
    sk_instagram_reels,
    post_data,
    page,
    column_count
  ) {
    var start = 0;
    var end = parseInt(column_count);
    var multiplicand = page - 1;
    var return_post_data = [];
    if (page != 1) {
      start = multiplicand * end;
      end = start + end;
    }
    if (end - 1 > post_data.length) {
      end = post_data.length;
    }
    for (var i = start; i < end; i++) {
      return_post_data.push(post_data[i]);
    }
    return return_post_data;
  }
  function skLayoutSliderSetting(sk_instagram_reels) {
    var autoplay = false;
    var loop = false;
    if (getDsmSetting(sk_instagram_reels, "autoplay") == 1) {
      var delay = getDsmSetting(sk_instagram_reels, "delay") * 1500;
      autoplay = { delay: delay };
      loop = true;
    }
    var swiper = new Swiper(".swiper-layout-slider.swiper-container", {
      loop: loop,
      autoplay: autoplay,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
  function skLayoutSliderArrowUI(sk_instagram_reels) {
    var arrow_background_color = getDsmSetting(
      sk_instagram_reels,
      "arrow_background_color"
    );
    var arrow_color = getDsmSetting(sk_instagram_reels, "arrow_color");
    var arrow_opacity = getDsmSetting(sk_instagram_reels, "arrow_opacity");
    sk_instagram_reels
      .find(".swiper-button-prev i,.swiper-button-next i")
      .mouseover(function () {
        jQuery(this).css({
          opacity: "1",
          "border-color": arrow_background_color,
        });
      })
      .mouseout(function () {
        jQuery(this).css({
          "border-color": arrow_color,
          opacity: arrow_opacity,
        });
      });
    sk_instagram_reels
      .find(".swiper-button-prev i,.swiper-button-next i")
      .css({
        "border-color": arrow_color,
        opacity: arrow_opacity,
        color: arrow_color,
      });
    var feed_h = sk_instagram_reels
      .find(".sk-ww-instagram-reels-item .sk-ig-post-img")
      .innerHeight();
    var feed_h_2 = feed_h / 2;
    sk_instagram_reels
      .find(".swiper-button-prev,.swiper-button-next")
      .css({ top: feed_h_2 + "px" });
  }
  function makeResponsive(jQuery, sk_instagram_reels) {
    var sk_instagram_reels_width = sk_instagram_reels.width();
    if (sk_instagram_reels_width <= 320) {
    } else if (sk_instagram_reels_width <= 481) {
    } else if (sk_instagram_reels_width <= 641) {
    } else if (sk_instagram_reels_width <= 961) {
    } else if (sk_instagram_reels_width <= 1025) {
    } else if (sk_instagram_reels_width <= 1281) {
    } else if (sk_instagram_reels_width > 1281) {
    }
    if (getDsmSetting(sk_instagram_reels, "post_item_type") == 1) {
      var thisH = 0;
      var maxHeight = 0;
      jQuery(".sk-ww-instagram-reels-item").each(function () {
        thisH = jQuery(this).height();
        if (thisH > maxHeight) {
          maxHeight = thisH;
        }
      });
      $(".sk-ww-instagram-reels-item ").height(maxHeight);
    }
  }
  function applyCustomUi(jQuery, sk_instagram_reels) {
    sk_instagram_reels.find(".loading-img").hide();
    sk_instagram_reels.css({
      width: sk_instagram_reels.parent().width(),
      display: "block",
    });
    var feed_width_item = sk_instagram_reels
      .find(".sk-ww-instagram-reels-item")
      .width();
    var sk_instagram_reels_width =
      feed_width_item == 0
        ? sk_instagram_reels.outerWidth(true).toFixed(0)
        : sk_instagram_reels.outerWidth(true).toFixed(0) - 8;
    sk_instagram_reels.css({ height: "auto" });
    var column_count = sk_instagram_reels.find(".column_count").text();
    var column_count_on_mobile = sk_instagram_reels
      .find(".column_count_on_mobile")
      .text();
    if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
      sk_instagram_reels_width = sk_instagram_reels
        .find(".sk-ig-all-posts")
        .width();
    }
    if (
      jQuery(document).width() <= 320 ||
      jQuery(document).width() <= 481 ||
      jQuery(document).width() <= 641
    ) {
      column_count = 2;
      if (
        getDsmSetting(sk_instagram_reels, "column_count") == 1 ||
        jQuery(document).width() <= 430
      ) {
        column_count = 1;
      }
    }
    if (sk_instagram_reels_width <= 480 && column_count_on_mobile == 1) {
      column_count = sk_instagram_reels.find(".column_count").text();
    }
    var border_size = 0;
    var background_color = getDsmSetting(
      sk_instagram_reels,
      "details_bg_color"
    );
    var space_between_images = parseFloat(
      sk_instagram_reels.find(".space_between_images").text()
    );
    var margin_between_images = parseFloat(
      parseFloat(space_between_images).toFixed(2) / 2
    );
    var scroll_width = getScrollbarWidth();
    var scroll_width_d = scroll_width / parseInt(column_count);
    scroll_width_d = scroll_width_d + scroll_width_d * -1;
    var total_space_between_images =
      parseFloat(space_between_images).toFixed(2) * parseFloat(column_count);
    var pic_width =
      (parseFloat(sk_instagram_reels_width).toFixed(2) -
        parseFloat(total_space_between_images).toFixed(2)) /
        parseFloat(column_count).toFixed(2) -
      scroll_width_d;
    var load_more_btn_width =
      parseFloat(pic_width) * parseFloat(column_count) +
      (parseFloat(space_between_images) * parseFloat(column_count) -
        parseFloat(space_between_images));
    var font_family = sk_instagram_reels.find(".font_family").text();
    var details_bg_color = sk_instagram_reels.find(".details_bg_color").text();
    var details_font_color = sk_instagram_reels
      .find(".details_font_color")
      .text();
    var details_link_color = sk_instagram_reels
      .find(".details_link_color")
      .text();
    var details_link_hover_color = sk_instagram_reels
      .find(".details_link_hover_color")
      .text();
    var button_bg_color = sk_instagram_reels.find(".button_bg_color").text();
    var button_text_color = sk_instagram_reels
      .find(".button_text_color")
      .text();
    var button_hover_bg_color = sk_instagram_reels
      .find(".button_hover_bg_color")
      .text();
    var button_hover_text_color = sk_instagram_reels
      .find(".button_hover_text_color")
      .text();
    var post_item_type = getDsmSetting(sk_instagram_reels, "post_item_type");
    sk_instagram_reels
      .find(".sk-ww-instagram-reels-item")
      .css({
        width: pic_width + "px",
        margin: margin_between_images + "px",
        "background-color": background_color,
        padding: border_size,
      });
    var profile_username =
      getDsmSetting(sk_instagram_reels, "title_all_caps") == 1
        ? "uppercase"
        : "normal";
    sk_instagram_reels
      .find(".sk-ig-profile-usename")
      .css({
        "text-transform": profile_username,
        "font-size":
          getDsmSetting(sk_instagram_reels, "title_font_size") + "px",
      });
    var profile_username =
      getDsmSetting(sk_instagram_reels, "details_all_caps") == 1
        ? "uppercase"
        : "normal";
    sk_instagram_reels
      .find(".sk-ig-profile-info")
      .css({
        "text-transform": profile_username,
        "font-size":
          getDsmSetting(sk_instagram_reels, "details_font_size") + "px",
      });
    jQuery(".sk-ig-post-meta").css({ "text-transform": profile_username });
    var hover_width = sk_instagram_reels
      .find(".sk-ww-instagram-reels-item")
      .width();
    var hover_height = sk_instagram_reels.find(".sk-ig-post-img").height();
    $(".sk-ig-post-hover")
      .mouseover(function () {
        jQuery(this)
          .parent()
          .find(".sk-play-count-container")
          .css({ display: "none" });
      })
      .mouseout(function () {
        jQuery(this)
          .parent()
          .find(".sk-play-count-container")
          .css({ display: "block" });
      });
    sk_instagram_reels
      .find(".sk-ig-post-hover")
      .css({
        width: hover_width + "px",
        margin: 0,
        padding: 0,
        "line-height": hover_width + "px",
      });
    sk_instagram_reels
      .find(".sk-ig-post-hover .fa")
      .css({ height: hover_width + "px", "line-height": hover_width + "px" });
    setTimeout(function () {
      var hover_height = sk_instagram_reels.find(".sk-ig-post-img").height();
      if (getDsmSetting(sk_instagram_reels, "show_post_hover") == 1) {
        sk_instagram_reels
          .find(".sk-ig-post-hover")
          .css({ "line-height": hover_height + "px" });
      } else {
        sk_instagram_reels
          .find(".sk-ig-post-hover")
          .css({
            height: hover_height + "px",
            "line-height": hover_height + "px",
          });
      }
    }, 500);
    sk_instagram_reels
      .find(".sk-ig-post-hover .fa")
      .css({ height: hover_width + "px", "line-height": hover_width + "px" });
    sk_instagram_reels
      .find(".sk-ig-profile-usename")
      .css({
        width: "100%",
        "text-align":
          getDsmSetting(sk_instagram_reels, "show_content_center") == 1
            ? "center"
            : "",
      });
    sk_instagram_reels
      .find(".sk-ww-instagram-reels-item .sk-ig-post-img")
      .css({ width: pic_width + "px", height: pic_width + 100 + "px" });
    sk_instagram_reels.css({
      "font-family": font_family,
      "background-color": details_bg_color,
    });
    jQuery(".sk-pop-ig-post").css({ "font-family": font_family });
    sk_instagram_reels
      .find(".instagram-user-root-container,.sk-ig-profile-usename")
      .css({ color: details_font_color });
    sk_instagram_reels
      .find(".instagram-user-root-container a")
      .css({ color: details_link_color });
    $(".instagram-user-root-container a")
      .mouseover(function () {
        $(this).css({ color: details_link_hover_color });
      })
      .mouseout(function () {
        $(this).css({ color: details_link_color });
      });
    sk_instagram_reels
      .find(".sk-ig-bottom-btn-container")
      .css({ display: "block", overflow: "hidden", margin: "0" });
    var margin_bottom_sk_ig_load_more_posts = space_between_images / 2;
    if (margin_bottom_sk_ig_load_more_posts == 0) {
      margin_bottom_sk_ig_load_more_posts = 3;
    }
    sk_instagram_reels
      .find(".sk-ig-load-more-posts, .sk-ig-bottom-follow-btn")
      .css({ "margin-bottom": margin_bottom_sk_ig_load_more_posts + "px" });
    sk_instagram_reels
      .find(
        ".instagram-user-container, .sk-ig-load-more-posts, .sk-ig-bottom-follow-btn"
      )
      .css({
        "background-color": button_bg_color,
        "border-color": button_bg_color,
        color: button_text_color,
      });
    sk_instagram_reels
      .find(
        ".instagram-user-container, .sk-ig-load-more-posts, .sk-ig-bottom-follow-btn"
      )
      .mouseover(function () {
        $(this).css({
          "background-color": button_hover_bg_color,
          "border-color": button_hover_bg_color,
          color: button_hover_text_color,
        });
      })
      .mouseout(function () {
        $(this).css({
          "background-color": button_bg_color,
          "border-color": button_bg_color,
          color: button_text_color,
        });
      });
    var padding_sk_ig_bottom_btn_container = margin_between_images;
    if (padding_sk_ig_bottom_btn_container == 0) {
      padding_sk_ig_bottom_btn_container = 5;
    }
    sk_instagram_reels
      .find(".sk-ig-bottom-btn-container")
      .css({ padding: padding_sk_ig_bottom_btn_container + "px" });
    jQuery(".sk-ww-instagram-reels").removeClass("col-sm-3");
    sk_instagram_reels
      .find(".sk-fb-event-item, .sk_powered_by")
      .css({
        "margin-bottom":
          getDsmSetting(sk_instagram_reels, "space_between_events") + "px",
      });
    applyPopUpColors(sk_instagram_reels);
    sk_instagram_reels.css({
      width: sk_instagram_reels_width + "px",
      display: "block",
    });
    if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
      skLayoutSliderArrowUI(sk_instagram_reels);
      setTimeout(function () {
        skLayoutSliderArrowUI(sk_instagram_reels);
      }, 500);
      setTimeout(function () {
        skLayoutSliderArrowUI(sk_instagram_reels);
      }, 800);
      sk_instagram_reels.css({
        width: sk_instagram_reels.parent().width(),
        display: "block",
      });
      if (window.innerWidth <= 480) {
        sk_instagram_reels.css({
          width: window.innerWidth - 15.5 + "px",
          display: "block",
        });
      }
      if (scroll_width > 8) {
        if (window.innerWidth <= 480) {
          jQuery(".swiper-button-next").css({ right: "2px" });
        } else if (window.innerWidth <= 700) {
          jQuery(".swiper-button-next").css({ right: "10px" });
        }
      }
    }
    jQuery("head").append(
      '<style type="text/css">' +
        getDsmSetting(sk_instagram_reels, "custom_css") +
        "</style>"
    );
    makeResponsive(jQuery, sk_instagram_reels);
  }
  function applyPopUpColors(popup_container) {
    var pop_up_bg_color = popup_container.find(".pop_up_bg_color").text();
    var pop_up_font_color = popup_container.find(".pop_up_font_color").text();
    var pop_up_link_color = popup_container.find(".pop_up_link_color").text();
    var details_font_size = popup_container.find(".details_font_size").text();
    popup_container
      .find(".sk-popup-container")
      .css({
        "font-size": details_font_size,
        color: pop_up_font_color,
        background: pop_up_bg_color,
      });
    popup_container.find(".white-popup a").css({ color: pop_up_link_color });
    var sk_media_post_pop_up = jQuery(
      ".mfp-s-ready .sk-media-post-pop-up .ig_media"
    ).innerHeight();
    var sk_popup_user_container = jQuery(
      ".mfp-s-ready .sk-popup-user-container"
    ).innerHeight();
    var sk_ig_feed_m_t_3px = jQuery(
      ".mfp-s-ready .sk-ig-feed-m-t-3px"
    ).innerHeight();
    var sk_ig_pic_text =
      sk_media_post_pop_up - sk_popup_user_container - sk_ig_feed_m_t_3px - 110;
    jQuery(".mfp-s-ready .sk-ig-pic-text").css("line-height", " 1.5");
    if ($(window).innerWidth() >= 700) {
      jQuery(".mfp-s-ready .sk-ig-pic-text").css("max-height", sk_ig_pic_text);
    } else {
      jQuery(".mfp-s-ready .sk-ig-pic-text").css("max-height", "70000");
    }
  }
  function loadGoogleFont(font_family) {
    var web_safe_fonts = [
      "Inherit",
      "Impact, Charcoal, sans-serif",
      "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      "Century Gothic, sans-serif",
      "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
      "Verdana, Geneva, sans-serif",
      "Copperplate, 'Copperplate Gothic Light', fantasy",
      "'Courier New', Courier, monospace",
      "Georgia, Serif",
    ];
    if (font_family && !web_safe_fonts.includes(font_family)) {
      loadCssFile("https://fonts.googleapis.com/css?family=" + font_family);
    }
  }
  function addDescriptiveTagAttributes(_sk) {
    _sk.find("a").each(function (i, v) {
      var title = jQuery(v).text();
      jQuery(v).attr("title", title);
    });
    _sk.find("img").each(function (i, v) {
      var src = jQuery(v).attr("src");
      jQuery(v).attr("alt", src);
    });
  }
  function getClientId() {
    var _gaCookie = document.cookie.match(/(^|[;,]\s?)_ga=([^;,]*)/);
    if (_gaCookie) return _gaCookie[2].match(/\d+\.\d+$/)[0];
  }
  function getSkEmbedId(sk_class) {
    var embed_id = sk_class.attr("embed-id");
    if (embed_id == undefined) {
      embed_id = sk_class.attr("data-embed-id");
    }
    return embed_id;
  }
  function getSkSetting(sk_class, key) {
    return sk_class.find("div." + key).text();
  }
  function setCookieSameSite() {
    document.cookie =
      "AC-C=ac-c;expires=Fri, 31 Dec 2025 23:59:59 GMT;path=/;HttpOnly;SameSite=Lax";
  }
  setCookieSameSite();
  function getIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0)
      return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
    else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11;
    else return 0;
  }
  function isSafariBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        return 0;
      } else {
        return 1;
      }
    }
  }
  if (getIEVersion() > 0 || isSafariBrowser() > 0) {
    loadIEScript("https://cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js");
    loadIEScript("https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js");
  }
  function loadIEScript(url) {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    (
      document.getElementsByTagName("head")[0] || document.documentElement
    ).appendChild(scriptTag);
  }
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }
  function sk_increaseView(user_info) {
    if (!user_info) return;
    var update_views_url =
      "https://views.accentapi.com/add_view.php?user_id=0&embed_id=" +
      user_info.embed_id;
    if (app_url.includes("local") && sk_app_url) {
      update_views_url =
        sk_app_url +
        "views.accentapi.com/add_view.php?user_id=0&embed_id=" +
        user_info.embed_id;
    }
    jQuery.ajax(update_views_url);
  }
  function isTooDarkColor(hexcolor) {
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    if (hexcolor.indexOf("rgb") != -1) {
      let rgbstr = hexcolor;
      let v = getRGB(rgbstr);
      r = v[0];
      g = v[1];
      b = v[2];
    }
    b = isNaN(b) ? 0 : b;
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    if (yiq < 60) {
    } else {
    }
    return yiq < 60 ? true : false;
  }
  function linkify(html) {
    var temp_text = html.split("https://www.").join("https://");
    temp_text = temp_text.split("www.").join("https://www.");
    var exp =
      /((href|src)=["']|)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return temp_text.replace(exp, function () {
      return arguments[1]
        ? arguments[0]
        : '<a href="' + arguments[3] + '">' + arguments[3] + "</a>";
    });
  }
  function skGetEnvironmentUrls(folder_name) {
    var scripts = document.getElementsByTagName("script");
    var scripts_length = scripts.length;
    var search_result = -1;
    var other_result = -1;
    var app_url = "https://widgets.sociablekit.com/";
    var app_backend_url = "https://api.accentapi.com/v1/";
    var app_file_server_url = "https://data.accentapi.com/feed/";
    var sk_app_url = "https://sociablekit.com/app/";
    var sk_api_url = "https://api.sociablekit.com/";
    for (var i = 0; i < scripts_length; i++) {
      var src_str = scripts[i].getAttribute("src");
      if (src_str != null) {
        var other_folder = "";
        if (folder_name == "facebook-page-playlist") {
          other_folder = "facebook-page-playlists";
        } else if (folder_name == "linkedin-page-posts") {
          other_folder = "linkedin-page-post";
        } else if (folder_name == "linkedin-profile-posts") {
          other_folder = "linkedin-profile-post";
        } else if (folder_name == "facebook-hashtag-posts") {
          other_folder = "facebook-hashtag-feed";
        } else if (folder_name == "facebook-page-events") {
          other_folder = "facebook-events";
        } else if (folder_name == "facebook-page-posts") {
          other_folder = "facebook-feed";
          if (document.querySelector(".sk-ww-facebook-feed")) {
            var element = document.getElementsByClassName(
              "sk-ww-facebook-feed"
            )[0];
            element.classList.add("sk-ww-facebook-page-posts");
          }
        }
        other_result = src_str.search(other_folder);
        search_result = src_str.search(folder_name);
        if (search_result >= 1 || other_result >= 1) {
          var src_arr = src_str.split(folder_name);
          app_url = src_arr[0];
          app_url = app_url.replace(
            "displaysocialmedia.com",
            "sociablekit.com"
          );
          if (app_url.search("local") >= 1) {
            app_backend_url = "http://localhost:3000/v1/";
            app_url = "https://localtesting.com/SociableKIT_Widgets/";
            app_file_server_url =
              "https://localtesting.com/SociableKIT_FileServer/feed/";
            sk_app_url = "https://localtesting.com/SociableKIT/";
            sk_api_url = "http://127.0.0.1:8000/";
          } else {
            app_url = "https://widgets.sociablekit.com/";
          }
        }
      }
    }
    return {
      app_url: app_url,
      app_backend_url: app_backend_url,
      app_file_server_url: app_file_server_url,
      sk_api_url: sk_api_url,
      sk_app_url: sk_app_url,
    };
  }
  function changeBackSlashToBR(text) {
    if (text) {
      for (var i = 1; i <= 10; i++) {
        text = text.replace("\n", "</br>");
      }
    }
    return text;
  }
  function sKGetScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    var inner = document.createElement("div");
    outer.appendChild(inner);
    var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }
  async function showUrlData(
    element,
    url,
    post_id,
    type = "",
    show_thumbnail = 1
  ) {
    element.hide();
    var read_one_url =
      app_file_server_url.replace("feed", "url-tags") +
      post_id +
      ".json?nocache=" +
      new Date().getTime();
    fetch(read_one_url, { method: "get" })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          var free_data_url =
            app_file_server_url.replace("feed/", "get_fresh_url_tags.php") +
            "?post_id=" +
            post_id +
            "&url=" +
            url;
          response = await jQuery.ajax(free_data_url);
          displayUrlData(response, element, type, show_thumbnail);
          return response;
        }
      })
      .then((response) => {
        if (response != undefined) {
          displayUrlData(response, element, type, show_thumbnail);
        }
      });
  }
  async function displayUrlData(response, element, type, show_thumbnail = 1) {
    var meta_holder = jQuery(element);
    var html = "";
    if (!response || response.error) {
      if (meta_holder.html()) {
        meta_holder.show();
      }
      return;
    }
    if (
      response.message &&
      response.message == "Data not available. Please try again."
    ) {
      return;
    }
    if (
      response.messages &&
      response.messages.length > 0 &&
      response.messages[0] ==
        "PDF files that are over 10Mb are not supported by Google Docs Viewer"
    ) {
      var data = response.url;
      if (response.url) {
        data = response.url.replace("https://", "").split("/");
      }
      if (data.length > 0) {
        if (data.length > 1) {
          response.title = data[data.length - 1];
        }
        response.description = data[0].replace("www.", "");
      }
    }
    html += "<a href='" + response.url + "' link-only target='_blank'>";
    html +=
      "<div class='sk-link-article-container' style='background: #eeeeee;color: black !important; font-weight: bold !important; border-radius: 2px; border: 1px solid #c3c3c3; box-sizing: border-box; word-wrap: break-word;'>";
    if (response.thumbnail_url && show_thumbnail == 1) {
      html +=
        "<image alt='No alternative text description for this image' class='sk-link-article-image sk_post_img_link' onerror='this.style.display=\"none\"' src='" +
        response.thumbnail_url +
        "'/>";
    }
    if (response.title) {
      html +=
        "<div class='sk-link-article-title' style='padding: 8px;'>" +
        response.title +
        "</div>";
    }
    if (type && type == 6) {
      if (response.description && response.description.length > 0) {
        response.description =
          response.description.length > 140
            ? response.description.substring(0, 140) + " ..."
            : response.description;
      }
    }
    if (
      response.description &&
      response.description.indexOf("[vc_row]") !== -1 &&
      response.url
    ) {
      var pathArray = response.url.split("/");
      var protocol = pathArray[0];
      if (pathArray.length > 2) {
        var host = pathArray[2];
        var url = protocol + "//" + host;
        html +=
          "<div class='sk-link-article-description' style='padding: 8px;color: grey;font-weight: 100;font-size: 14px;'>" +
          url +
          "</div>";
      }
    } else if (response.description) {
      html +=
        "<div class='sk-link-article-description' style='padding: 8px;color: #000000;font-weight: 100;font-size: 14px;'>" +
        response.description +
        "</div>";
    } else if (response.url && response.url.includes("instagram.com/p/")) {
      html +=
        "<image style='padding: 8px;' alt='No alternative text description for this image' class='sk-ig-default' onerror='this.style.display=\"none\"' src='https://i1.wp.com/sociablekit.com/wp-content/uploads/2019/01/instagram.png'/>";
      html +=
        "<div class='sk-link-article-description' style='padding: 8px;margin-left:15%;color: #000000;font-weight: 600;font-size: 14px;'>View this post in instagram</div>";
      html +=
        "<div class='sk-link-article-description' style='padding: 0px 8px ;margin-left:15%;margin-bottom:10px;color: #000000;font-weight: 100;font-size: 10px;'>" +
        response.url +
        "</div>";
    }
    html += "</div>";
    html += "</a>";
    meta_holder.html(html);
    meta_holder.css("display", "block");
    meta_holder.css("margin-bottom", "15px");
    meta_holder
      .find(".sk-ig-default")
      .closest(".sk-link-article-container")
      .css("display", "inline-block");
    meta_holder
      .find(".sk-ig-default")
      .closest(".sk-link-article-container")
      .css("width", "100%");
    meta_holder.find(".sk-ig-default").css("width", "20%");
    meta_holder.find(".sk-ig-default").css("float", "left");
    applyMasonry();
  }
  function slugifyString(str) {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();
    var from =
      "ÃÃ„Ã‚Ã€ÃƒÃ…ÄŒÃ‡Ä†ÄŽÃ‰ÄšÃ‹ÃˆÃŠáº¼Ä”È†ÃÃŒÃŽÃÅ‡Ã‘Ã“Ã–Ã’Ã”Ã•Ã˜Å˜Å”Å Å¤ÃšÅ®ÃœÃ™Ã›ÃÅ¸Å½Ã¡Ã¤Ã¢Ã Ã£Ã¥ÄÃ§Ä‡ÄÃ©Ä›Ã«Ã¨Ãªáº½Ä•È‡Ã­Ã¬Ã®Ã¯ÅˆÃ±Ã³Ã¶Ã²Ã´ÃµÃ¸Ã°Å™Å•Å¡Å¥ÃºÅ¯Ã¼Ã¹Ã»Ã½Ã¿Å¾Ã¾ÃžÄÄ‘ÃŸÃ†aÂ·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    str = str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return str;
  }
  function skGetBranding(sk_, user_info) {
    var html = "";
    if (!user_info) return;
    var slugify_string = "";
    if (user_info.solution_name) {
      slugify_string = slugifyString(user_info.solution_name);
      user_info.tutorial_link =
        "https://www.sociablekit.com/tutorials/embed-" +
        slugify_string +
        "-website/";
      if (user_info.website_builder) {
        user_info.tutorial_link =
          "https://www.sociablekit.com/tutorials/embed-" + slugify_string;
        slugify_string = slugifyString(user_info.website_builder);
        user_info.tutorial_link =
          user_info.tutorial_link + "-" + slugify_string;
      }
    }
    if (user_info.type == 39) {
      user_info.tutorial_link =
        "https://www.sociablekit.com/tutorials/embed-google-my-business-photos-website/";
    }
    if (user_info.type == 9) {
      user_info.tutorial_link =
        "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    } else if (user_info.type == 26) {
      user_info.tutorial_link =
        "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    }
    if (user_info.show_branding && user_info.show_branding == 1) {
      var fontFamily = getSkSetting(sk_, "font_family");
      var link_color = getSkSetting(sk_, "details_link_color");
      var details_bg_color = getSkSetting(sk_, "details_bg_color");
      if (link_color == "") {
        link_color = "rgb(52, 128, 220)";
      }
      if (
        user_info.type == 5 &&
        details_bg_color &&
        isTooDarkColor(link_color) == false &&
        isTooDarkColor(details_bg_color) == false
      ) {
        link_color = "#3480dc";
      }
      var temporary_tutorial_link = user_info.tutorial_link;
      if (temporary_tutorial_link.endsWith("/") == false) {
        temporary_tutorial_link = temporary_tutorial_link + "/";
      }
      html +=
        "<div class='sk_branding' style='padding:10px; display:block; text-align:center; text-decoration: none !important; color:#555; font-family:" +
        fontFamily +
        "; font-size:15px;'>";
      html +=
        "<a class='tutorial_link' href='" +
        temporary_tutorial_link +
        "' target='_blank' style='text-underline-position:under; color:" +
        link_color +
        ";font-size:15px;'>";
      html +=
        user_info.solution_name + " <i class='fa fa-bolt'></i> by SociableKIT";
      html += "</a>";
      html += "</div>";
    }
    return html;
  }
  function getRGB(rgbstr) {
    return rgbstr
      .substring(4, rgbstr.length - 1)
      .replace(/ /g, "")
      .replace("(", "")
      .split(",");
  }
  function freeTrialEndedMessage(solution_info) {
    var sk_error_message = "";
    sk_error_message += "<ul class='sk_error_message'>";
    sk_error_message +=
      "<li><a href='" +
      solution_info.tutorial_link +
      "' target='_blank'>Customized " +
      solution_info.solution_name +
      " feed by SociableKIT</a></li>";
    sk_error_message +=
      "<li>If youâ€™re the owner of this website, thereâ€™s something wrong with your account.</li>";
    sk_error_message += "<li>Please contact support now.</li>";
    sk_error_message += "</ul>";
    return sk_error_message;
  }
  function isFreeTrialEnded(start_date) {
    var start_date = new Date(start_date);
    var current_date = new Date();
    var difference = current_date.getTime() - start_date.getTime();
    difference = parseInt(difference / (1000 * 60 * 60 * 24));
    return difference > 7 ? true : false;
  }
  function unableToLoadSKErrorMessage(
    solution_info,
    additional_error_messages
  ) {
    var sk_error_message = "<ul class='sk_error_message'>";
    sk_error_message +=
      "<li><a href='" +
      solution_info.tutorial_link +
      "' target='_blank'>Customized " +
      solution_info.solution_name +
      " feed by SociableKIT</a></li>";
    sk_error_message +=
      "<li>Unable to load " + solution_info.solution_name + ".</li>";
    for (var i = 0; i < additional_error_messages.length; i++) {
      sk_error_message += additional_error_messages[i];
    }
    sk_error_message +=
      "<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>";
    sk_error_message += "</ul>";
    return sk_error_message;
  }
  function widgetValidation(_sk, data) {
    if (data.user_info) {
      var user_info = data.user_info;
      if (user_info.status == 6 && user_info.start_date) {
        var start_date = new Date(user_info.start_date).getTime();
        var current_date = new Date().getTime();
        var difference = current_date - start_date;
        difference = parseInt(difference / (1000 * 60 * 60 * 24));
        user_info.show_feed = difference > 7 ? false : true;
      } else if (user_info.status == 7 && user_info.cancellation_date) {
        var cancellation_date = new Date(user_info.cancellation_date).getTime();
        var current_date = new Date().getTime();
        user_info.show_feed = current_date > cancellation_date ? false : true;
      } else if (
        user_info.status == 0 ||
        user_info.status == 2 ||
        user_info.status == 10
      ) {
        user_info.show_feed = false;
      }
      if (!user_info.show_feed) {
        var sk_error_message = generateBlueMessage(_sk, user_info);
        _sk.find(".first_loading_animation").hide();
        _sk.html(sk_error_message);
      }
      return user_info.show_feed;
    }
  }
  function generateBlueMessage(_sk, user_info) {
    var tutorial_link = "";
    if (user_info.solution_name) {
      var slugify_string = slugifyString(user_info.solution_name);
      tutorial_link =
        "https://www.sociablekit.com/tutorials/embed-" +
        slugify_string +
        "-website/";
    }
    if (user_info.type == 9) {
      tutorial_link =
        "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    } else if (user_info.type == 26) {
      tutorial_link =
        "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    }
    var sk_error_message = "";
    if (user_info.show_feed == false) {
      if (!user_info.message || user_info.message == "") {
        var sk_error_message = "<ul class='sk_error_message'>";
        sk_error_message +=
          "<li><a href='" +
          tutorial_link +
          "' target='_blank'>" +
          user_info.solution_name +
          " powered by SociableKIT</a></li>";
        sk_error_message +=
          "<li>If youâ€™re the owner of this website or SociableKIT account used, we found some errors with your account.</li>";
        sk_error_message +=
          "<li>Please login your SociableKIT account to fix it.</li>";
        sk_error_message += "</ul>";
        user_info.message = sk_error_message;
      }
      sk_error_message = user_info.message;
    } else if (
      user_info.solution_name == null &&
      user_info.type == null &&
      user_info.start_date == null
    ) {
      sk_error_message = "<p class='sk_error_message'>";
      sk_error_message +=
        "The SociableKIT solution does not exist. If you think this is a mistake, please contact support.";
      sk_error_message += "</p>";
    } else if (user_info.to_encode == 1) {
      var styles =
        "style='text-align: center !important; margin-top: 50px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 30px; color: #555555; padding: 20px 45px; border-radius: 3px;'";
      sk_error_message = "<div " + styles + ">";
      sk_error_message +=
        "<div style='width: auto; display: inline-block;'><i class='fa fa-spinner fa-pulse'></i></div> <div style='width: auto; display: inline-block;'>" +
        user_info.solution_name +
        " will appear soon. Please check back later!</div>";
      sk_error_message += "</div>";
    } else {
      sk_error_message = "<ul class='sk_error_message'>";
      sk_error_message +=
        "<li><a href='" +
        tutorial_link +
        "' target='_blank'>Customized " +
        user_info.solution_name +
        " feed by SociableKIT</a></li>";
      sk_error_message +=
        "<li>Our system is syncing with your " +
        user_info.solution_name +
        " feed, please check back later.</li>";
      if (user_info.type == 5) {
        var username = getDsmSetting(_sk, "username");
        sk_error_message +=
          "<li>Make sure your instagram account <a target='_blank' href='https://www.instagram.com/" +
          username +
          "' target='_blank'><b>@" +
          username +
          "</b></a> is connected.</li>";
      }
      sk_error_message +=
        "<li>It usually takes only a few minutes, but might take up to 24 hours. We appreciate your patience.</li>";
      sk_error_message +=
        "<li>We will notify you via email once your " +
        user_info.solution_name +
        " feed is ready.</li>";
      sk_error_message +=
        "<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>";
      sk_error_message += "</ul>";
    }
    return sk_error_message;
  }
  function generateSolutionMessage(_sk, embed_id) {
    var json_url = sk_api_url + "api/user_embed/info/" + embed_id;
    var sk_error_message = "";
    jQuery
      .getJSON(json_url, function (data) {
        var sk_error_message = generateBlueMessage(_sk, data);
        _sk.find(".first_loading_animation").hide();
        _sk.html(sk_error_message);
      })
      .fail(function (e) {
        console.log(e);
      });
  }
  function copyInput(copy_button, copy_input) {
    var copy_button_orig_html = copy_button.html();
    copy_input.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      if (msg == "successful") {
        copy_button.html("<i class='fa fa-clipboard'></i> Copied!");
        setTimeout(function () {
          copy_button.html(copy_button_orig_html);
        }, 3000);
      } else {
        alert("Copying text command was " + msg + ".");
      }
    } catch (err) {
      alert("Oops, unable to copy.");
    }
  }
  function getDefaultLinkedInPageProfilePicture(profile_picture) {
    if (profile_picture && profile_picture.indexOf("data:image/gif") != -1) {
      profile_picture = "https://gmalcilk.sirv.com/iamge.JPG";
    }
    return profile_picture;
  }
  function readImageUrl(
    sk_class_,
    image,
    identifier,
    index,
    folder_name = false
  ) {
    if (!app_file_server_url) {
      return;
    }
    var image_thumbnail = encodeURIComponent(image);
    var image_url =
      app_file_server_url.replace("feed/", "") +
      "images/" +
      identifier +
      ".jpg";
    if (folder_name) {
      folder_name = "images/" + folder_name;
      var image_url =
        app_file_server_url.replace("feed/", "") +
        folder_name +
        "/" +
        identifier +
        ".jpg";
    }
    fetch(image_url)
      .then(function () {
        jQuery("<img>")
          .attr("src", image_url)
          .on("load", () => displayImageData(sk_class_, identifier, image_url))
          .on("error", () =>
            saveImageUrl(
              sk_class_,
              image_thumbnail,
              identifier,
              image_url,
              folder_name
            )
          );
      })
      .catch(function () {
        saveImageUrl(
          sk_class_,
          image_thumbnail,
          identifier,
          image_url,
          folder_name
        );
      });
  }
  function displayImageData(sk_class_, identifier, image_url) {
    sk_class_
      .find('img[data-image="' + identifier + '"]')
      .attr("src", image_url);
    sk_class_
      .find('div[data-image="' + identifier + '"] img')
      .attr("src", image_url);
    sk_class_
      .find('div[data-image="' + identifier + '"]')
      .css({ "background-image": "url(" + image_url + ")" });
  }
  function saveImageUrl(
    sk_class_,
    image_thumbnail,
    identifier,
    image_url,
    folder_name
  ) {
    var embed_id = getDsmEmbedId(sk_class_);
    var sync_url =
      app_backend_url +
      "images/save?identifier=" +
      identifier +
      "&image_url=" +
      image_thumbnail;
    if (folder_name) {
      sync_url =
        app_backend_url +
        "images/save?identifier=" +
        identifier +
        "&image_url=" +
        image_thumbnail +
        "&folder_name=" +
        folder_name;
    }
    fetch(sync_url)
      .then(function () {
        displayImageData(sk_class_, identifier, image_url);
      })
      .catch(function () {
        console.log("Cant save:", identifier);
      });
  }
  function main() {
    if (window && window.FontAwesomeConfig) {
      console.log("set auto transform");
      window.FontAwesomeConfig = { autoReplaceSvg: false };
    }
    function loadSettingsData(
      sk_instagram_reels,
      json_settings_url,
      json_feed_url
    ) {
      fetch(json_feed_url, { method: "get" })
        .then(function (response) {
          if (!response.ok) {
            loadSettingsData(
              sk_instagram_reels,
              json_settings_url,
              json_settings_url
            );
            return;
          }
          response.json().then(function (data) {
            var settings_data = data;
            original_data = data;
            if (data.settings) {
              settings_data = data.settings;
            }
            if (!settings_data.type) {
              loadSettingsData(
                sk_instagram_reels,
                json_settings_url,
                json_settings_url
              );
              return;
            }
            var web_safe_fonts = ["Roboto"];
            var is_font_included = web_safe_fonts.indexOf(
              settings_data.font_family
            );
            if (is_font_included > -1) {
              loadCssFile(
                "https://fonts.googleapis.com/css?family=" +
                  settings_data.font_family
              );
            }
            if (data.show_feed == false) {
              sk_instagram_reels.prepend(data.message);
              sk_instagram_reels.find(".loading-img").hide();
              sk_instagram_reels.find(".first_loading_animation").hide();
            } else {
              var settings = data;
              var settings_html = "";
              settings_html +=
                "<div class='display-none sk-twitter-settings' style='display:none;'>";
              jQuery.each(settings_data, function (key, value) {
                settings_html += "<div class='" + key + "'>" + value + "</div>";
              });
              settings_html += "</div>";
              sk_instagram_reels.prepend(settings_html);
              if (getDsmSetting(sk_instagram_reels, "layout") == 3) {
                loadCssFile(app_url + "libs/swiper/swiper.min.css");
                loadCssFile(app_url + "libs/swiper/swiper.css?v=ranndomchars");
              }
              settings_html = "";
              if (data.settings) {
                loadFeed(sk_instagram_reels);
              } else {
                requestFeedData(sk_instagram_reels);
              }
            }
          });
        })
        .catch(function (err) {
          loadSettingsData(
            sk_instagram_reels,
            json_settings_url,
            json_settings_url
          );
        });
    }
    jQuery(document).ready(function ($) {
      jQuery(".sk-ww-instagram-reels").each(function () {
        var sk_instagram_reels = jQuery(this);
        var embed_id = getDsmEmbedId(sk_instagram_reels);
        var new_sk_instagram_reels_width = jQuery(window).height() + 100;
        sk_instagram_reels.height(new_sk_instagram_reels_width);
        var json_settings_url =
          app_file_server_url.replace("feed", "") +
          "settings/" +
          embed_id +
          "/settings.json?nocache=" +
          new Date().getTime();
        var json_feed_url =
          app_file_server_url +
          embed_id +
          ".json?nocache=" +
          new Date().getTime();
        loadSettingsData(sk_instagram_reels, json_settings_url, json_feed_url);
      });
      jQuery(document).on(
        "click",
        ".sk-ww-instagram-reels .sk-ww-instagram-reels-item",
        function () {
          var clicked_element = jQuery(this);
          var code = clicked_element.attr("data-code");
          var content_src = clicked_element.find(".sk-pop-ig-post:first");
          var show_pop_up = clicked_element
            .closest(".sk-ww-instagram-reels")
            .find(".show_pop_up")
            .text();
          var open_link_in_new_tab = 1;
          var link_name = open_link_in_new_tab == 1 ? "_blank" : "_parent";
          current_position = clicked_element.attr("data-position");
          current_position = parseInt(current_position);
          showDsmInstagramFeedPopUp(jQuery, content_src, clicked_element);
          if (current_position == 0) {
            jQuery(".prev_sk_ig_feed_post").remove();
          }
          readFreshContent(clicked_element);
        }
      );
      jQuery(document).on("click", ".prev_sk_ig_feed_post", function () {
        var clicked_element = jQuery(this);
        var new_clicked_element = jQuery(".sk_selected_ig_post").prev(
          ".sk-ww-instagram-reels-item"
        );
        var code = new_clicked_element.attr("data-code");
        var content_src = new_clicked_element.find(".sk-pop-ig-post:first");
        current_position = current_position - 1;
        if (jQuery(".sk-ww-instagram-reels .layout").text() == 3) {
          content_src = jQuery(".sk-pop-ig-post:eq(" + current_position + ")");
          new_clicked_element = jQuery(
            ".sk-ww-instagram-reels-item:eq(" + current_position + ")"
          );
        }
        showDsmInstagramFeedPopUp(jQuery, content_src, new_clicked_element);
        if (current_position == 0) {
          jQuery(".prev_sk_ig_feed_post").remove();
        }
        readFreshContent(new_clicked_element);
      });
      jQuery(document).on("click", ".next_sk_ig_feed_post", function () {
        var clicked_element = jQuery(this);
        clicked_element.html(
          "<i data-fa-i2svg='' class='fa fa-spinner fa-pulse' aria-hidden='true'></i>"
        );
        var new_clicked_element = jQuery(".sk_selected_ig_post").next(
          ".sk-ww-instagram-reels-item"
        );
        var code = new_clicked_element.attr("data-code");
        var content_src = new_clicked_element.find(".sk-pop-ig-post:first");
        current_position = current_position + 1;
        if (jQuery(".sk-ww-instagram-reels .layout").text() == 3) {
          content_src = jQuery(".sk-pop-ig-post:eq(" + current_position + ")");
          new_clicked_element = jQuery(
            ".sk-ww-instagram-reels-item:eq(" + current_position + ")"
          );
        }
        showDsmInstagramFeedPopUp(jQuery, content_src, new_clicked_element);
        var data_length = typeof data_storage ? data_storage.length : 0;
        if (current_position + 1 == data_length) {
          jQuery(".next_sk_ig_feed_post").remove();
        }
        readFreshContent(new_clicked_element);
      });
      jQuery(document).on(
        "click",
        ".sk-ww-instagram-reels .sk-ig-load-more-posts",
        function () {
          if (jQuery(this).attr("disabled") == "disabled") {
            return false;
          }
          jQuery(this).attr("disabled", "disabled");
          var current_btn = jQuery(this);
          var current_btn_text = current_btn.text();
          var sk_instagram_reels = jQuery(this).closest(
            ".sk-ww-instagram-reels"
          );
          var embed_id = getDsmEmbedId(sk_instagram_reels);
          var next_page = sk_instagram_reels.find(".sk-ig-next-page").text();
          var json_url = next_page;
          var end_of_posts_text = sk_instagram_reels
            .find(".end_of_posts_text")
            .text();
          var view_on_instagram_text = sk_instagram_reels
            .find(".view_on_instagram_text")
            .text();
          jQuery(this).html(
            "<i data-fa-i2svg='' class='fa fa-spinner fa-pulse' aria-hidden='true'></i>"
          );
          setTimeout(function () {
            var post_items = "";
            var enable_button = false;
            var old_last_key = last_key;
            last_key =
              old_last_key +
              parseInt(getDsmSetting(sk_instagram_reels, "post_count"));
            for (var i = old_last_key; i < last_key; i++) {
              if (typeof data_storage[i] != "undefined") {
                data_storage[i].multi_hashtag =
                  getDsmSetting(sk_instagram_reels, "enable_multiple_id") == 1
                    ? true
                    : false;
                data_storage[i].show_post_hover = getDsmSetting(
                  sk_instagram_reels,
                  "show_post_hover"
                );
                post_items += getFeedItem(data_storage[i], sk_instagram_reels);
              }
            }
            if (data_bio && data_bio.profile_pic_url) {
              readImageUrl(
                sk_instagram_reels,
                data_bio.profile_pic_url_hd,
                data_bio.username,
                0
              );
            }
            if (data_storage.length >= last_key) {
              enable_button = true;
            }
            sk_instagram_reels.find(".sk-ig-all-posts").append(post_items);
            current_btn.html(current_btn_text);
            if (enable_button) {
              sk_instagram_reels.find(".sk-ig-load-more-posts").show();
            } else {
              sk_instagram_reels.find(".sk-ig-load-more-posts").hide();
            }
            current_btn.removeAttr("disabled");
            applyCustomUi(jQuery, sk_instagram_reels);
            for (var i = old_last_key; i < last_key; i++) {
              if (data_storage[i] && typeof data_storage[i] != "undefined") {
                var code = data_storage[i].code;
                readImageUrl(
                  sk_instagram_reels,
                  data_storage[i].full_pic_src,
                  data_storage[i].code,
                  i,
                  "instagram-reels/" + embed_id
                );
              }
            }
          }, 300);
        }
      );
      jQuery(document).on(
        "click",
        ".sk-ww-instagram-reels .sk-watermark",
        function () {
          jQuery(".sk-ww-instagram-reels .sk-message").slideToggle();
        }
      );
      jQuery(window).resize(function () {
        jQuery(".sk-ww-instagram-reels").each(function () {
          var sk_instagram_reels = jQuery(this);
          sk_instagram_reels.css({ width: "100%" });
          applyCustomUi(jQuery, sk_instagram_reels);
        });
      });
    });
  }
})(window, document);
