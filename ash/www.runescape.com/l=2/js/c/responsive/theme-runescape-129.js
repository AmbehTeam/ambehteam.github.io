var CM;

CM = CM || {};

CM.lib = CM.lib || {};

CM.global = {
  listenForm: function(pageObj) {
    var listenedForm;
    if (pageObj == null) {
      pageObj = {};
    }
    listenedForm = $('*[data-abide]');
    if ((pageObj.formSelector != null) && pageObj.formSelector !== null) {
      listenedForm = $(pageObj.formSelector);
    }
    listenedForm.on('forminvalid.zf.abide', function() {
      $('#l-vista__container').addClass('l-vista__container--style-attention');
      if (typeof grecaptcha !== "undefined" && grecaptcha !== null) {
        return grecaptcha.reset();
      }
    });
    $('*[data-show-password]').on('click', function() {
      var passwordFieldIdString, passwordFieldIds, thisBox;
      thisBox = $(this);
      passwordFieldIdString = thisBox.data('show-password');
      passwordFieldIds = passwordFieldIdString.split(',');
      return passwordFieldIds.forEach(function(thisId) {
        var passwordField;
        passwordField = $('#' + thisId);
        if (thisBox.is(':checked')) {
          return passwordField.attr('type', 'text');
        } else {
          return passwordField.attr('type', 'password');
        }
      });
    });
    return listenedForm.on('submit', function(ev) {
      if ((pageObj.characterNameValid != null) && !pageObj.characterNameValid) {
        ev.preventDefault();
        return CM.global.validateNameField(pageObj);
      }
    });
  },
  ajaxNameCheck: function(characterName, pageObj) {
    var ajaxUrl, nameToTestData;
    nameToTestData = {
      displayname: encodeURIComponent(characterName)
    };
    ajaxUrl = 'https://secure.runescape.com/m=account-creation/check_displayname.ajax';
    if ((pageObj.ajaxNameCheckUrl != null) && pageObj.ajaxNameCheckUrl !== null) {
      ajaxUrl = pageObj.ajaxNameCheckUrl;
    }
    if (pageObj.characterNameSuggestions !== null && pageObj.characterNameSuggestions !== void 0 && pageObj.characterNameSuggestions.length > 0) {
      nameToTestData.noNameSuggestions = true;
    }
    return $.ajax({
      type: 'POST',
      cache: false,
      url: ajaxUrl,
      data: nameToTestData,
      success: function(data) {
        return CM.global.handleNameResults(data, pageObj);
      },
      dataType: 'json'
    });
  },
  validateNameField: function(pageObj) {
    var characterName;
    pageObj.characterNameLabel.removeClass('a-label--checker-checking-done');
    pageObj.characterNameLabel.addClass('a-label--checker-checking');
    characterName = pageObj.characterNameField.val();
    if ((characterName != null) && characterName !== '') {
      return CM.global.ajaxNameCheck(characterName, pageObj);
    } else {
      pageObj.characterNameValid = false;
      return pageObj.characterNameLabel.removeClass('a-label--checker-checking');
    }
  },
  handleNameResults: function(data, pageObj) {
    if (data.displayNameIsValid !== void 0 && data.displayNameIsValid === 'false') {
      if ((pageObj.characterNameSuggestions != null) && pageObj.characterNameSuggestions !== null && pageObj.characterNameSuggestions.length > 0) {
        return CM.global.showNameSuggestions(pageObj);
      } else if (data.nameSuggestions !== void 0 && data.nameSuggestions.length > 0) {
        pageObj.characterNameSuggestions = data.nameSuggestions;
        return CM.global.showNameSuggestions(pageObj);
      } else {
        CM.global.hideNameSuggestions(pageObj);
        pageObj.characterNameValid = true;
        return pageObj.characterNameLabel.removeClass('a-label--checker-checking');
      }
    } else {
      CM.global.hideNameSuggestions(pageObj);
      pageObj.characterNameValid = true;
      pageObj.characterNameLabel.addClass('a-label--checker-checking-done');
      return pageObj.characterNameField.removeClass('is-invalid-input');
    }
  },
  redirectUser: function(url, timeout) {
    if (timeout == null) {
      timeout = 2000;
    }
    return setTimeout(function() {
      return document.location = url;
    }, timeout);
  },
  sendGaEvents: function(gaEvents, category, callback, nonInteraction, timeout) {
    var eventNameStr;
    if (callback == null) {
      callback = false;
    }
    if (nonInteraction == null) {
      nonInteraction = false;
    }
    if (timeout == null) {
      timeout = 0;
    }
    eventNameStr = 'gaEvent';
    if (nonInteraction) {
      eventNameStr = 'gaEventNI';
    }
    window.dataLayer = window.dataLayer || [];
    return gaEvents.forEach(function(gaEvent) {
      return window.dataLayer.push({
        'event': eventNameStr,
        'gaEventCat': category,
        'gaEventAct': gaEvent,
        'eventCallback': function() {
          if (callback) {
            return callback();
          }
        },
        'eventTimeout': timeout
      });
    });
  }
};

CM.lib.characterCounter = {
  initialise: function() {
    return $('*[data-character-counter]').each(function() {
      var $thisCounter, $thisTextField, maxLength;
      $thisCounter = $(this);
      $thisTextField = $('#' + $thisCounter.data('character-counter'));
      maxLength = $thisTextField.attr('maxlength');
      CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
      $thisTextField.on('keypress keyup', function() {
        var entryLength;
        entryLength = CM.lib.characterCounter.getTextLength($thisTextField);
        if (entryLength > maxLength) {
          return false;
        } else {
          return CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
        }
      });
      return $thisTextField.bind('cut paste', function() {
        var charactersOver, currentValue, entryLength;
        entryLength = CM.lib.characterCounter.getTextLength($thisTextField);
        if (entryLength > maxLength) {
          currentValue = $thisTextField.val();
          charactersOver = entryLength - maxLength;
          $thisTextField.val(currentValue.substring(0, currentValue.length - charactersOver));
        }
        return CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
      });
    });
  },
  getTextLength: function(field) {
    return field.val().length + (field.val().match(/\n/g) || []).length;
  },
  updateCharacterCounter: function(thisTextField, characterCounter) {
    var thisCurrentEntry, thisMaxValue, thisRemainingChars;
    thisMaxValue = thisTextField.attr('maxlength');
    thisCurrentEntry = CM.lib.characterCounter.getTextLength(thisTextField);
    thisRemainingChars = thisMaxValue - thisCurrentEntry;
    return characterCounter.text(thisRemainingChars);
  }
};

CM.lib.characterCounter = {
  initialise: function() {
    return $('*[data-character-counter]').each(function() {
      var $thisCounter, $thisTextField, maxLength;
      $thisCounter = $(this);
      $thisTextField = $('#' + $thisCounter.data('character-counter'));
      maxLength = $thisTextField.attr('maxlength');
      CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
      $thisTextField.on('keypress keyup', function() {
        var entryLength;
        entryLength = CM.lib.characterCounter.getTextLength($thisTextField);
        if (entryLength > maxLength) {
          return false;
        } else {
          return CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
        }
      });
      return $thisTextField.bind('cut paste', function() {
        var charactersOver, currentValue, entryLength;
        entryLength = CM.lib.characterCounter.getTextLength($thisTextField);
        if (entryLength > maxLength) {
          currentValue = $thisTextField.val();
          charactersOver = entryLength - maxLength;
          $thisTextField.val(currentValue.substring(0, currentValue.length - charactersOver));
        }
        return CM.lib.characterCounter.updateCharacterCounter($thisTextField, $thisCounter);
      });
    });
  },
  getTextLength: function(field) {
    return field.val().length + (field.val().match(/\n/g) || []).length;
  },
  updateCharacterCounter: function(thisTextField, characterCounter) {
    var thisCurrentEntry, thisMaxValue, thisRemainingChars;
    thisMaxValue = thisTextField.attr('maxlength');
    thisCurrentEntry = CM.lib.characterCounter.getTextLength(thisTextField);
    thisRemainingChars = thisMaxValue - thisCurrentEntry;
    return characterCounter.text(thisRemainingChars);
  }
};

CM.lib.constants = {
  HIDE_CLASS: 'x-display-none'
};

CM.lib.scroller = {
  cssClasses: {
    hideScrollerEnd: 'm-scroller-end--appearance-hidden'
  },
  dataAttributes: {
    jumpLink: '*[data-scroller-jump]',
    scrollerTop: '*[data-scroller-top]',
    scrollerBottom: '*[data-scroller-bottom]',
    scrollerBottomDefault: 'scroller-jump-bottom'
  },
  adjustScrollIcons: function($container) {
    var containerHeight, currentScroll, maxScroll, thisPane;
    maxScroll = Math.ceil($container[0].scrollHeight);
    currentScroll = $container.scrollTop();
    thisPane = $('#' + $container.data('scroller-list'));
    containerHeight = Math.ceil($container.height());
    if (maxScroll > containerHeight) {
      if (currentScroll === 0) {
        $(CM.lib.scroller.dataAttributes.scrollerTop, thisPane).addClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
        return $(CM.lib.scroller.dataAttributes.scrollerBottom, thisPane).removeClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
      } else if (Math.ceil((currentScroll + containerHeight) >= maxScroll)) {
        $(CM.lib.scroller.dataAttributes.scrollerBottom, thisPane).addClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
        return $(CM.lib.scroller.dataAttributes.scrollerTop, thisPane).removeClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
      } else {
        $(CM.lib.scroller.dataAttributes.scrollerBottom, thisPane).removeClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
        return $(CM.lib.scroller.dataAttributes.scrollerTop, thisPane).removeClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
      }
    } else {
      $(CM.lib.scroller.dataAttributes.scrollerTop, thisPane).addClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
      return $(CM.lib.scroller.dataAttributes.scrollerBottom, thisPane).addClass(CM.lib.scroller.cssClasses.hideScrollerEnd);
    }
  },
  jumpLinks: function() {
    return $(CM.lib.scroller.dataAttributes.jumpLink).on('click', function(ev) {
      var scrollBottom, thisJump, thisJumpBottom, thisJumpList, thisList;
      ev.preventDefault();
      thisJump = $(this);
      thisJumpList = thisJump.data('scroller-jump-list');
      thisList = $('*[data-scroller-list="' + thisJumpList + '"]');
      scrollBottom = thisList[0].scrollHeight;
      thisJumpBottom = thisJump.data(CM.lib.scroller.dataAttributes.scrollerBottomDefault);
      if (thisJumpBottom != null) {
        scrollBottom = thisJumpBottom;
      }
      if (thisJump.data('scroller-jump') === 'top') {
        return thisList.scrollTop(0);
      } else {
        return thisList.scrollTop(scrollBottom);
      }
    });
  }
};

CM.lib.tabs = {
  switchTabs: function(showTabSelector, hideTabSelectors, hiddenClass) {
    var hideTab, i, len, selector;
    if (hideTabSelectors == null) {
      hideTabSelectors = [];
    }
    if (hiddenClass == null) {
      hiddenClass = CM.lib.constants.HIDE_CLASS;
    }
    hideTab = function(selector) {
      return $(selector).addClass(hiddenClass);
    };
    if (Array.isArray(hideTabSelectors)) {
      for (i = 0, len = hideTabSelectors.length; i < len; i++) {
        selector = hideTabSelectors[i];
        hideTab(selector);
      }
    } else {
      hideTab(hideTabSelectors);
    }
    return $(showTabSelector).removeClass(hiddenClass);
  }
};

CM.lib.wizard = {
  cssClasses: {
    activeSlide: 'm-wizard__slide--state-active',
    activeMenuOption: 'm-wizard__menu-item--state-active'
  },
  dataAttributes: {
    wizard: '*[data-js-wizard]',
    wizardMenu: '*[data-js-wizard-menu]',
    wizardMenuSlide: '*[data-js-wizard-menu-slide]',
    wizardNextSlide: '*[data-js-wizard-next-slide]',
    wizardSlides: '*[data-js-wizard-slide]'
  },
  events: {
    slideChange: 'slideChange'
  },
  getCurrentSlideNumber: function(wizard) {
    return $('.' + CM.lib.wizard.cssClasses.activeSlide, wizard).data('js-wizard-slide');
  },
  goToSlide: function(wizard, slideNumber) {
    $(CM.lib.wizard.dataAttributes.wizardSlides, wizard).removeClass(CM.lib.wizard.cssClasses.activeSlide);
    $(CM.lib.wizard.dataAttributes.wizardMenuSlide, wizard).removeClass(CM.lib.wizard.cssClasses.activeMenuOption);
    $("*[data-js-wizard-slide='" + slideNumber + "']", wizard).addClass(CM.lib.wizard.cssClasses.activeSlide);
    $("*[data-js-wizard-menu-slide='" + slideNumber + "']", wizard).addClass(CM.lib.wizard.cssClasses.activeMenuOption);
    return $(CM.lib.wizard.dataAttributes.wizard).trigger(CM.lib.wizard.events.slideChange, [slideNumber]);
  },
  initialise: function() {
    return $('*[data-js-wizard]').each(function() {
      var initSlideNumber, menuDom, thisWizard, wizardMenu, wizardSlides;
      thisWizard = $(this);
      wizardMenu = $(CM.lib.wizard.dataAttributes.wizardMenu, thisWizard);
      wizardSlides = $(CM.lib.wizard.dataAttributes.wizardSlides, thisWizard);
      menuDom = '';
      initSlideNumber = CM.lib.wizard.getCurrentSlideNumber(thisWizard);
      wizardSlides.each(function() {
        var activeSlideClass, thisSlide, thisSlideNumber, thisSlideTest, thisSlideTitle;
        thisSlide = $(this);
        thisSlideTitle = thisSlide.data('js-wizard-slide-title');
        thisSlideTest = thisSlide.data('js-wizard-slide-test');
        thisSlideNumber = thisSlide.data('js-wizard-slide');
        activeSlideClass = initSlideNumber === thisSlideNumber ? ' ' + CM.lib.wizard.cssClasses.activeMenuOption : '';
        return menuDom += "<a href='#' class='m-wizard__menu-item" + activeSlideClass + "' data-js-wizard-menu-slide='" + thisSlideNumber + "' data-test='wizard-menu-" + thisSlideTest + "'>" + thisSlideTitle + "</a>";
      });
      wizardMenu.html(menuDom);
      $(CM.lib.wizard.dataAttributes.wizardMenuSlide, thisWizard).on('click', function(ev) {
        var thisSlideNumber;
        ev.preventDefault();
        thisSlideNumber = $(this).data('js-wizard-menu-slide');
        return CM.lib.wizard.goToSlide(thisWizard, thisSlideNumber);
      });
      return $(CM.lib.wizard.dataAttributes.wizardNextSlide).on('click', function(ev) {
        var nextSlide;
        ev.preventDefault();
        nextSlide = CM.lib.wizard.getCurrentSlideNumber(thisWizard) + 1;
        return CM.lib.wizard.goToSlide(thisWizard, nextSlide);
      });
    });
  }
};

CM.accountCreation = {
  emailTakenError: false,
  formSelector: null,
  initialise: function() {
    if ($('#facebooklogin').length) {
      CM.facebook.loadFacebookAPI(CM.facebook.setUpEvents);
    }
    return $(document).ready((function(_this) {
      return function() {
        CM.accountCreation.formSelector = '#create-email-form';
        _this.handleTracking();
        CM.global.listenForm(CM.accountCreation);
        return CM.dateEntry.initialise();
      };
    })(this));
  },
  handleTracking: function() {
    var gaEvent;
    CM.accountCreation.emailTakenError = emailTakenError || false;
    if (CM.accountCreation.emailTakenError) {
      gaEvent = ['Account email already taken'];
      return CM.global.sendGaEvents(gaEvent, 'account-creation', false, true);
    }
  }
};

CM.accountRecovery = {
  dataAttributeSelectors: {
    backToEmailLink: 'back-to-email-link',
    checkEmailTab: 'check-email-page',
    emailDidNotArrive: 'email-did-not-arrive-link',
    hiddenPassword: '*[data-password-wrapper].' + CM.lib.constants.HIDE_CLASS,
    noEmailTab: 'no-email-page'
  },
  emailTabs: function(pageObj) {
    if (pageObj == null) {
      pageObj = CM.accountRecovery;
    }
    $("[data-js='" + pageObj.dataAttributeSelectors.emailDidNotArrive + "']").on('click', function(ev) {
      ev.preventDefault();
      return CM.lib.tabs.switchTabs("[data-js='" + pageObj.dataAttributeSelectors.noEmailTab + "']", "[data-js='" + pageObj.dataAttributeSelectors.checkEmailTab + "']");
    });
    return $("[data-js='" + pageObj.dataAttributeSelectors.backToEmailLink + "']").on('click', function(ev) {
      ev.preventDefault();
      return CM.lib.tabs.switchTabs("[data-js='" + pageObj.dataAttributeSelectors.checkEmailTab + "']", "[data-js='" + pageObj.dataAttributeSelectors.noEmailTab + "']");
    });
  },
  paymentTypeChanges: function() {
    var $earliestSubWrapper, $paymentTypeField, $paymentWrapper, $transactionIdWrapper, paymentPaypalType, paymentType;
    $paymentTypeField = $('#paymenttype');
    $paymentWrapper = $('#payment-details-wrapper');
    $earliestSubWrapper = $('#billing_earliestsubs');
    $transactionIdWrapper = $('#transaction-id-wrapper');
    paymentPaypalType = '6';
    paymentType = $paymentTypeField.val();
    $('*[data-type-group]').css('display', 'none');
    if (paymentType && paymentType !== '0') {
      $('*[data-type-group-' + paymentType + ']').each(function() {
        var thisTypeGroup;
        thisTypeGroup = $(this);
        if (thisTypeGroup.data('type-group') === 'inline') {
          return thisTypeGroup.css('display', 'inline');
        } else {
          return thisTypeGroup.css('display', 'block');
        }
      });
      if (paymentType === paymentPaypalType && (parseInt($('#earliestsubsyear').val()) < 2009 && parseInt($('#earliestsubsmonth').val()) < 12)) {
        $transactionIdWrapper.css('display', 'none');
      } else {
        $transactionIdWrapper.css('display', 'block');
      }
      $earliestSubWrapper.css('display', 'block');
      return $paymentWrapper.slideDown();
    } else {
      $earliestSubWrapper.css('display', 'none');
      return $paymentWrapper.slideUp();
    }
  },
  showStates: function(countryDropDown) {
    var stateDropdown, stateDropdownId;
    stateDropdownId = countryDropDown.data('state');
    stateDropdown = $('#' + stateDropdownId);
    if (countryDropDown.val() === usCountryCode) {
      return stateDropdown.css('display', 'block');
    } else {
      return stateDropdown.css('display', 'none');
    }
  },
  manualInit: function() {
    var addPasswordLink, countryStateBoxes, movedHouseToggle, recoveryToggle;
    recoveryToggle = function() {
      var readOnly;
      readOnly = false;
      if ($('*[data-recovery-toggle]').is(':checked')) {
        return $('#recovery-answer-container').stop().slideUp();
      } else {
        return $('#recovery-answer-container').stop().slideDown();
      }
    };
    movedHouseToggle = function() {
      if ($('#moved_house_yes').is(':checked')) {
        return $('#house-move-answers-container').stop().slideDown();
      } else {
        return $('#house-move-answers-container').stop().slideUp();
      }
    };
    $('*[data-recovery-toggle]').on('click', recoveryToggle);
    $('#house-move-radio-container').on('change', movedHouseToggle);
    $('#paymenttype').on('change', function() {
      return CM.accountRecovery.paymentTypeChanges();
    });
    $('#earliestsubsmonth').on('change', function() {
      return CM.accountRecovery.paymentTypeChanges();
    });
    $('#earliestsubsyear').on('change', function() {
      return CM.accountRecovery.paymentTypeChanges();
    });
    countryStateBoxes = $('*[data-state]');
    countryStateBoxes.on('change', function() {
      return CM.accountRecovery.showStates($(this));
    });
    countryStateBoxes.each(function() {
      return CM.accountRecovery.showStates($(this));
    });
    addPasswordLink = $('#add-password');
    addPasswordLink.on('click', function(ev) {
      ev.preventDefault();
      $(CM.accountRecovery.dataAttributeSelectors.hiddenPassword + ':first').removeClass(CM.lib.constants.HIDE_CLASS);
      if ($(CM.accountRecovery.dataAttributeSelectors.hiddenPassword).length === 0) {
        return addPasswordLink.remove();
      }
    });
    this.paymentTypeChanges();
    CM.lib.characterCounter.initialise();
    recoveryToggle();
    return movedHouseToggle();
  },
  accountIdentified: function() {
    if (redirectStr === '') {
      return this.initialise();
    } else {
      return CM.global.sendGaEvents(gaEvents, 'Account Recovery', function() {
        return CM.global.redirectUser(redirectStr);
      });
    }
  },
  setRecoverFromGame: function() {
    var cookieExpire;
    cookieExpire = new Date(Date.now() + 1800000);
    return Cookies.set('account-appeal__requested-game-recovery', 'requested', {
      expires: cookieExpire
    });
  },
  getRecoverFromGame: function() {
    if (Cookies.get('account-appeal__requested-game-recovery')) {
      if (typeof gaEvents !== "undefined" && gaEvents !== null) {
        return gaEvents.push('Started appeal process after game prompt');
      }
    }
  },
  initialise: function() {
    return $(document).ready((function(_this) {
      return function() {
        if (typeof gaEvents !== "undefined" && gaEvents !== null) {
          CM.global.sendGaEvents(gaEvents, 'Account Recovery', false, true);
        }
        return CM.global.listenForm();
      };
    })(this));
  }
};

CM.account = {
  linkedAccounts: {
    initialise: function() {
      return $('*[data-js-facebook-login]').on('click', function(ev) {
        ev.preventDefault();
        if (FB.getAuthResponse() === null || typeof FB.getAuthResponse() === 'undefined') {
          if (getWebScriptPermissions) {
            return FB.login(function(response) {
              if (response.authResponse) {
                return fbLoginRedirect();
              }
            }, {
              scope: getWebScriptPermissions
            });
          } else {
            return FB.login(function(response) {
              if (response.authResponse) {
                return fbLoginRedirect();
              }
            });
          }
        } else {
          return fbLoginRedirect();
        }
      });
    }
  }
};

CM.adventurersLog = {
  initialPrivacyOption: null,
  dataAttributeSelectors: {
    privacyOptions: '*[data-profile-setting]'
  },
  idSelectors: {
    submitForm: '#change-settings'
  },
  settings: function() {
    CM.global.listenForm();
    CM.adventurersLog.initialPrivacyOption = $(CM.adventurersLog.dataAttributeSelectors.privacyOptions + ':checked').val();
    return $(CM.adventurersLog.dataAttributeSelectors.privacyOptions).on('change', function() {
      if ($(CM.adventurersLog.dataAttributeSelectors.privacyOptions + ':checked').val() === CM.adventurersLog.initialPrivacyOption) {
        return $($(CM.adventurersLog.idSelectors.submitForm)).prop('disabled', true);
      } else {
        return $($(CM.adventurersLog.idSelectors.submitForm)).prop('disabled', false);
      }
    });
  }
};

CM.authenticator = {
  slide: {
    get: 1,
    scan: 2,
    enter: 3
  },
  cssClasses: {
    phoneChanging: 'ua-authenticator-phone--state-changing'
  },
  dataAttributes: {
    phone: '*[data-js-authenticator-phone]',
    qrCode: '*[data-js-qr-code]',
    enterAuthCode: '*[data-js-enter-code]'
  },
  enable: function() {
    var authenticatorPhone;
    CM.lib.wizard.initialise();
    CM.global.listenForm();
    $(CM.lib.wizard.dataAttributes.wizard).on(CM.lib.wizard.events.slideChange, function(ev, slideNumber) {
      if (slideNumber === CM.authenticator.slide.scan) {
        return $(CM.lib.wizard.dataAttributes.wizardMenuSlide).focus();
      } else if (slideNumber === CM.authenticator.slide.enter) {
        return $(CM.authenticator.dataAttributes.enterAuthCode).focus();
      }
    });
    $(CM.authenticator.dataAttributes.qrCode).qrcode({
      'text': 'otpauth://totp/Jagex:' + displayName + '?secret=' + key + '&issuer=Jagex',
      'width': '225',
      'height': '225',
      'render': 'canvas'
    });
    authenticatorPhone = $(CM.authenticator.dataAttributes.phone);
    return setInterval((function() {
      authenticatorPhone.addClass(CM.authenticator.cssClasses.phoneChanging);
      return setTimeout((function() {
        var newNumber;
        newNumber = Math.floor(Math.random() * 900000) + 100000;
        authenticatorPhone.attr('data-js-code', newNumber);
        return authenticatorPhone.removeClass(CM.authenticator.cssClasses.phoneChanging);
      }), 2000);
    }), 7000);
  }
};

CM.characterName = {
  ajaxNameCheckUrl: null,
  characterNameValid: false,
  characterNameField: null,
  characterNameLabel: null,
  confirmPopup: false,
  currentName: null,
  formSelector: '#character-name-form',
  typingTimeout: 300,
  cssClasses: {
    checkerChecking: 'a-label--checker-checking',
    checkerDone: 'a-label--checker-checking-done',
    invalidInput: 'is-invalid-input',
    isVisible: 'is-visible',
    sectionHiddenClass: 'uc-confirm-form--display-none'
  },
  dataAttributeSelectors: {
    backButton: '*[data-js="back-btn"]',
    characterNameEntry: '*[data-js="character-name-entry"]',
    characterNameConfirm: '*[data-js="character-name-confirm"]',
    characterNameHidden: '*[data-js="character-name-hidden"]',
    confirmForm: '*[data-js="confirm-form"]',
    setForm: '*[data-js="set-form"]',
    setSubmit: '*[data-js="set-submit"]',
    nameError: '*[data-js="name-error"]'
  },
  initialise: function() {
    CM.characterName.ajaxNameCheckUrl = ajaxNameCheckUrl;
    CM.characterName.currentName = currentName;
    return $(document).ready((function(_this) {
      return function() {
        CM.characterName.characterNameField = $('#character-name');
        CM.characterName.characterNameLabel = $('#character-name-label');
        CM.characterName.listenForm();
        if (CM.characterName.characterNameField.length) {
          return CM.characterName.nameInputCheck();
        }
      };
    })(this));
  },
  ajaxNameCheck: function(characterName, pageObj) {
    var ajaxUrl;
    if (characterName == null) {
      characterName = CM.characterName.characterNameField.val();
    }
    if (pageObj == null) {
      pageObj = CM.characterName;
    }
    ajaxUrl = "https://secure.runescape.com/m=displaynames/check_name.ws?displayname=" + characterName;
    if ((pageObj.ajaxNameCheckUrl != null) && pageObj.ajaxNameCheckUrl !== null) {
      ajaxUrl = pageObj.ajaxNameCheckUrl + characterName;
    }
    return $.ajax({
      url: ajaxUrl,
      success: function(response) {
        return CM.characterName.handleNameResults(response);
      },
      error: function() {
        return CM.characterName.handleNameResults('ERROR');
      }
    });
  },
  handleNameResults: function(response, pageObj) {
    if (pageObj == null) {
      pageObj = CM.characterName;
    }
    if (response.match(/^NOK/)) {
      pageObj.characterNameValid = false;
      pageObj.characterNameField.addClass(pageObj.cssClasses.invalidInput);
      $(CM.characterName.dataAttributeSelectors.setSubmit).prop('disabled', true);
      pageObj.characterNameLabel.removeClass(pageObj.cssClasses.checkerChecking);
      if (pageObj.characterNameField.val()) {
        return pageObj.characterNameLabel.find(pageObj.dataAttributeSelectors.nameError).addClass(pageObj.cssClasses.isVisible);
      }
    } else {
      pageObj.characterNameValid = true;
      pageObj.characterNameLabel.addClass(pageObj.cssClasses.checkerDone);
      pageObj.characterNameField.removeClass(pageObj.cssClasses.invalidInput);
      $(CM.characterName.dataAttributeSelectors.setSubmit).prop('disabled', false);
      pageObj.characterNameLabel.find(pageObj.dataAttributeSelectors.nameError).removeClass(pageObj.cssClasses.isVisible);
      pageObj.characterNameLabel.one('webkitAnimationEnd msAnimationEnd animationend', function() {
        return pageObj.characterNameLabel.removeClass(pageObj.cssClasses.checkerChecking + " " + pageObj.cssClasses.checkerDone);
      });
      if (!response.match(/^OK/)) {
        return pageObj.characterNameLabel.removeClass(pageObj.cssClasses.checkerChecking);
      }
    }
  },
  listenForm: function(pageObj) {
    if (pageObj == null) {
      pageObj = CM.characterName;
    }
    $(CM.characterName.dataAttributeSelectors.setForm).on('submit', function(ev) {
      ev.preventDefault();
      if (pageObj.characterNameValid) {
        return CM.characterName.showConfirmForm();
      } else {
        return pageObj.validateNameField(pageObj);
      }
    });
    return $(CM.characterName.dataAttributeSelectors.backButton).on('click', function(ev) {
      ev.preventDefault();
      return CM.characterName.showSetForm();
    });
  },
  showConfirmForm: function() {
    var newName;
    $(CM.characterName.dataAttributeSelectors.setForm).addClass(CM.lib.constants.HIDE_CLASS);
    $(CM.characterName.dataAttributeSelectors.confirmForm).removeClass(CM.characterName.cssClasses.sectionHiddenClass);
    newName = $(CM.characterName.dataAttributeSelectors.characterNameEntry).val();
    $(CM.characterName.dataAttributeSelectors.characterNameHidden).val(newName);
    return $(CM.characterName.dataAttributeSelectors.characterNameConfirm).text(newName);
  },
  showSetForm: function() {
    $(CM.characterName.dataAttributeSelectors.setForm).removeClass(CM.lib.constants.HIDE_CLASS);
    $(CM.characterName.dataAttributeSelectors.confirmForm).addClass(CM.characterName.cssClasses.sectionHiddenClass);
    $(CM.characterName.dataAttributeSelectors.characterNameHidden).val('');
    return $(CM.characterName.dataAttributeSelectors.characterNameConfirm).text('');
  },
  nameInputCheck: function(pageObj) {
    var inputValidate, requestedName, timeout;
    if (pageObj == null) {
      pageObj = CM.characterName;
    }
    requestedName = pageObj.characterNameField.val();
    pageObj.characterNameLabel.removeClass(pageObj.cssClasses.checkerDone);
    timeout = null;
    pageObj.validateNameField();
    inputValidate = function() {
      if (requestedName !== pageObj.characterNameField.val()) {
        pageObj.characterNameValid = false;
        pageObj.validateNameField();
        return requestedName = pageObj.characterNameField.val();
      }
    };
    return pageObj.characterNameField.on('keyup change', function() {
      clearTimeout(timeout);
      $(CM.characterName.dataAttributeSelectors.setSubmit).prop('disabled', true);
      if (pageObj.characterNameField.val().length > 0) {
        pageObj.characterNameField.removeClass(pageObj.cssClasses.invalidInput);
        pageObj.characterNameLabel.find(pageObj.dataAttributeSelectors.nameError).removeClass(pageObj.cssClasses.isVisible);
        $(CM.characterName.dataAttributeSelectors.setSubmit).prop('disabled', false);
      }
      return timeout = setTimeout(inputValidate, pageObj.typingTimeout);
    });
  },
  validateNameField: function(pageObj) {
    var characterName;
    if (pageObj == null) {
      pageObj = CM.characterName;
    }
    pageObj.characterNameLabel.removeClass(pageObj.cssClasses.checkerDone);
    pageObj.characterNameLabel.addClass(pageObj.cssClasses.checkerChecking);
    characterName = pageObj.characterNameField.val();
    if ((characterName != null) && characterName !== '') {
      return pageObj.ajaxNameCheck(characterName, pageObj);
    } else {
      return pageObj.handleNameResults('NOK');
    }
  }
};

CM.dateEntry = {
  initialise: function() {
    return $('*[data-js-date-entry]').each(function() {
      var allDateFields, errorMessage, thisDateEntry;
      thisDateEntry = $(this);
      allDateFields = $('input', thisDateEntry);
      errorMessage = $('*[data-js-date-entry-error]', thisDateEntry);
      allDateFields.on('invalid.zf.abide', function() {
        return errorMessage.addClass('is-visible');
      });
      return allDateFields.on('change', function() {
        if ($('*[data-invalid]', thisDateEntry).length === 0) {
          return errorMessage.removeClass('is-visible');
        }
      });
    });
  }
};

CM.dob = {
  minimumDateVal: null,
  thisDateEntry: $('*[data-js-date-entry]'),
  dobErrorMessage: $('span[data-minimum-date-error]'),
  dobSubmitted: function() {
    if (redirectStr === '') {
      return this.initialise();
    } else {
      return CM.global.sendGaEvents(gaEvents, 'DOB', function() {
        return CM.global.redirectUser(redirectStr);
      });
    }
  },
  isDateAboveMinimum: function() {
    var dateStr, thisDateDay, thisDateMonth, thisDateYear, timeStr;
    thisDateYear = $('*[data-date-year]', CM.dob.thisDateEntry).val();
    thisDateMonth = $('*[data-date-month]', CM.dob.thisDateEntry).val();
    thisDateDay = $('*[data-date-day]', CM.dob.thisDateEntry).val();
    if (thisDateYear !== "" && thisDateMonth !== "" && thisDateDay !== "") {
      dateStr = new Date(thisDateYear + "-" + thisDateMonth + "-" + thisDateDay);
      timeStr = dateStr.getTime();
      if (CM.dob.minimumDateVal > timeStr) {
        return true;
      }
    }
    return false;
  },
  initialise: function() {
    return $(document).ready((function(_this) {
      return function() {
        if (typeof gaEvents !== "undefined" && gaEvents !== null) {
          CM.global.sendGaEvents(gaEvents, 'DOB');
        }
        CM.global.listenForm();
        CM.dateEntry.initialise();
        if (typeof minimumDate !== "undefined" && minimumDate !== null) {
          CM.dob.minimumDateVal = minimumDate;
        }
        if (CM.dob.minimumDateVal !== null) {
          $('input', CM.dob.thisDateEntry).on('change', function() {
            var numberOfEmptyFields;
            numberOfEmptyFields = $('input:empty', CM.dob.thisDateEntry).filter(function() {
              return $(this).val() === '';
            }).length;
            if ($('*[data-invalid]', CM.dob.thisDateEntry).length > 0 || numberOfEmptyFields > 0) {
              return CM.dob.dobErrorMessage.hide();
            } else if (CM.dob.isDateAboveMinimum()) {
              return CM.dob.dobErrorMessage.hide();
            } else {
              CM.dob.dobErrorMessage.css("display", "block");
              return $('#dob_form').foundation('addErrorClasses', $('*[data-date]', CM.dob.thisDateEntry));
            }
          });
          return $('#dob_form').on('submit', function(ev) {
            if ($('*[data-invalid]', CM.dob.thisDateEntry).length === 0) {
              if (CM.dob.isDateAboveMinimum()) {
                return CM.dob.dobErrorMessage.hide();
              } else {
                ev.preventDefault();
                CM.dob.dobErrorMessage.css("display", "block");
                $('#dob_form').foundation('addErrorClasses', $('*[data-date]', CM.dob.thisDateEntry));
                $('#l-vista__container').addClass('l-vista__container--style-attention');
                return false;
              }
            } else {
              return CM.dob.dobErrorMessage.hide();
            }
          });
        }
      };
    })(this));
  }
};

CM.emailRegister = {
  initialise: function() {
    return CM.global.listenForm();
  }
};

CM.facebook = {

  /*
  loadFacebookAPI
  This function loads in the Facebook API, and then initialises our RS app.
  params: initCallback (function to be called after the FB app has been initted)
   */
  loadFacebookAPI: function(initCallback) {
    if (typeof FB === "undefined" || FB === null) {
      if ($('#fb-root').length === 0) {
        $('body').prepend('<div id="fb-root"></div>');
      }
      window.fbAsyncInit = function() {
        FB.init({
          appId: PAGEGLOBALS.FB.appId,
          status: false,
          cookie: true,
          xfbml: true,
          version: PAGEGLOBALS.FB.apiVersion,
          oauth: true
        });
        if (initCallback) {
          return initCallback();
        }
      };
      return (function(d, debug) {
        var debugUrl, id, js, ref;
        js = '';
        id = 'facebook-jssdk';
        ref = d.getElementsByTagName('script')[0];
        debugUrl = '';
        if (debug) {
          debugUrl = '/debug';
        }
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/sdk" + debugUrl + ".js";
        return ref.parentNode.insertBefore(js, ref);
      })(document, false);
    }
  },
  fbLoginRedirect: function(destStr, target) {
    var checkLoginUrl, fbUrl, frameHeight, loginUrl;
    fbUrl = PAGEGLOBALS.FB.fbURL;
    checkLoginUrl = PAGEGLOBALS.FB.checkLoginURL;
    loginUrl = PAGEGLOBALS.FB.loginURL;
    frameHeight = 500;
    $.getJSON(checkLoginUrl + "?json=?", {
      tips: 0,
      token: FB.getAuthResponse().accessToken,
      expiry: FB.getAuthResponse().expiresIn,
      signed: FB.getAuthResponse().signedRequest
    }, function(data) {
      var popupTarget, popupTargetURL;
      popupTarget = '';
      popupTargetURL = '';
      if (data.sso < 0) {
        window.alert('There was a problem verifying your login. Please try again.');
        return false;
      } else if (data.sso.length > 1) {
        if (data.sna > -1) {
          popupTargetURL = fbUrl + "?key=" + data.sso + "&tps=0&" + destStr;
          if (target === '_parent') {
            window.parent.location = popupTargetURL;
          }
          frameHeight = 620;
        } else {
          if (target == null) {
            target = '';
          }
          popupTargetURL = loginUrl + "?key=" + data.sso + "?" + destStr;
          if (target === '_parent') {
            window.parent.location = popupTargetURL;
          } else if (target === '_top') {
            window.top.location = popupTargetURL;
          } else if (target === '_blank') {
            window.open(popupTargetURL, '_blank');
          } else {
            window.location = popupTargetURL;
          }
          return true;
        }
      } else {
        popupTargetURL = fbUrl + "?" + destStr;
        if (target === '_parent') {
          window.parent.location = popupTargetURL;
        }
      }
      if (target !== '_parent') {
        return $.fancybox({
          href: popupTargetURL,
          type: 'iframe',
          width: 462,
          height: frameHeight,
          autoSize: false,
          wrapCSS: 'loginFancyBoxFB'
        });
      }
    });
    return false;
  },
  fbButtonClickHandler: function(destination, target) {
    var destinationURL;
    destinationURL = destination || PAGEGLOBALS.FB.queryString;
    if ((typeof FB === "undefined" || FB === null) || typeof FB.getAuthResponse !== 'function') {
      return window.alert('Couldn\'t contact Facebook. Please try again later.');
    } else if (FB.getAuthResponse() == null) {
      return FB.login(function(response) {
        if (response.authResponse) {
          return CM.facebook.fbLoginRedirect(destinationURL, target);
        } else {
          return window.alert('Authentication with Facebook failed. Please try again.');
        }
      }, {
        scope: PAGEGLOBALS.FB.scope
      });
    } else {
      return CM.facebook.fbLoginRedirect(destinationURL, target);
    }
  },
  setUpEvents: function() {
    return $('#facebooklogin').click(function(ev) {
      var href, target, that;
      ev.preventDefault();
      that = $(this);
      href = that.data('redirecturl');
      target = that.attr('target');
      return CM.facebook.fbButtonClickHandler(href, target);
    });
  }
};

CM.login = {
  initialise: function() {
    if ($('#facebooklogin').length) {
      CM.facebook.loadFacebookAPI(CM.facebook.setUpEvents);
      PAGEGLOBALS.FB.queryString = PAGEGLOBALS.FB.queryString.replace(/amp;/g, "");
    }
    $('#login-form').attr("action", $('#login-form').attr("action") + window.location.hash);
    return $(document).ready((function(_this) {
      return function() {
        return CM.global.listenForm(CM.login);
      };
    })(this));
  }
};

CM.logout = {
  initialise: function() {
    if (typeof homeUrl !== "undefined" && homeUrl !== null) {
      return CM.global.redirectUser(homeUrl);
    }
  }
};

CM.menu = {
  initialise: function() {
    return $(document).ready(function() {
      CM.menu.nav();
      $(window).resize(function() {
        return CM.menu.nav();
      });
      return $('*[data-menu-toggle]').on('click', function() {
        return $(this).next().children('[data-menu-list]').toggleClass('c-menu__nav-list--state-open');
      });
    });
  },
  nav: function() {
    $('*[data-menu-list]').removeClass('c-menu__nav-list--state-open');
    $('*[data-menu]').removeClass('c-menu--style-stacked');
    return $('*[data-menu]').each(function() {
      var $menu, contentWidth, menuWidth;
      $menu = $(this);
      menuWidth = $menu.width();
      contentWidth = 0;
      $menu.children().each(function() {
        if ($(this).is(':visible')) {
          return contentWidth += Math.ceil($(this).width());
        }
      });
      if (contentWidth > menuWidth) {
        return $menu.addClass('c-menu--style-stacked');
      } else {
        return $menu.removeClass('c-menu--style-stacked');
      }
    });
  }
};

CM.premierClub = {
  dataAttributeSelectors: {
    priceBronze: '*[data-js=\'price-tertiary\']',
    priceSilver: '*[data-js=\'price-secondary\']',
    priceGold: '*[data-js=\'price-primary\']'
  },
  initialise: function() {
    return $(document).ready((function(_this) {
      return function() {
        return CM.premierClub.getPrices();
      };
    })(this));
  },
  getPrices: function() {
    var displayPrice;
    displayPrice = function(result) {
      var priceElement;
      switch (result.quantity) {
        case 6:
          priceElement = CM.premierClub.dataAttributeSelectors.priceSilver;
          break;
        case 12:
          priceElement = CM.premierClub.dataAttributeSelectors.priceGold;
          break;
        default:
          priceElement = CM.premierClub.dataAttributeSelectors.priceBronze;
      }
      return $(priceElement).html(result.localisedPrice);
    };
    return $.ajax({
      url: billingStoreUrl,
      timeout: 3000,
      dataType: 'json',
      success: function(data) {
        var i, len, ref, result, results;
        if (data.results != null) {
          ref = data.results;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            result = ref[i];
            results.push(displayPrice(result));
          }
          return results;
        }
      }
    });
  }
};

CM.ticketing = {
  dataAttributes: {
    dialogueList: '*[data-scroller-list]',
    dialogueListRead: '*[data-scroller-list="read"]',
    dialogueListUnread: '*[data-scroller-list="unread"]'
  },
  dialogue: function() {
    var $conversation, $dialogueList, $lastMessage, $lastMessageHeight, scrollBottomPosition;
    CM.global.listenForm();
    CM.lib.characterCounter.initialise();
    $lastMessage = $('*[data-message]').last();
    $lastMessageHeight = $lastMessage.height();
    $conversation = $('#conversation');
    scrollBottomPosition = $lastMessage.offset().top - ($lastMessageHeight / 2);
    $conversation.scrollTop(scrollBottomPosition);
    $(CM.lib.scroller.dataAttributes.scrollerBottom).data(CM.lib.scroller.dataAttributes.scrollerBottomDefault, scrollBottomPosition);
    $dialogueList = $(CM.ticketing.dataAttributes.dialogueList);
    $dialogueList.scroll(function() {
      return CM.lib.scroller.adjustScrollIcons($dialogueList);
    });
    CM.lib.scroller.adjustScrollIcons($dialogueList);
    return CM.lib.scroller.jumpLinks(scrollBottomPosition);
  },
  inbox: function() {
    var $inboxRead, $inboxUnread;
    $inboxUnread = $(CM.ticketing.dataAttributes.dialogueListUnread);
    $inboxRead = $(CM.ticketing.dataAttributes.dialogueListRead);
    if ($inboxUnread.offsetParent != null) {
      CM.lib.scroller.adjustScrollIcons($inboxUnread);
      CM.lib.scroller.jumpLinks();
      $('#read-label').one('click', function() {
        return CM.lib.scroller.jumpLinks();
      });
    } else {
      CM.lib.scroller.adjustScrollIcons($inboxRead);
      CM.lib.scroller.jumpLinks();
      $('#unread-label').one('click', function() {
        return CM.lib.scroller.jumpLinks();
      });
    }
    $('#message-tabs').on('change.zf.tabs', function() {
      CM.lib.scroller.adjustScrollIcons($inboxRead);
      return CM.lib.scroller.adjustScrollIcons($inboxUnread);
    });
    return $(CM.ticketing.dataAttributes.dialogueList).scroll(function() {
      return CM.lib.scroller.adjustScrollIcons($(this));
    });
  }
};

CM.video = {
  supportsVideoAutoplay: function(callback) {
    var play, video;
    video = document.createElement('video');
    video.paused = true;
    play = 'play' in video && video.play();
    return typeof callback === "function" && callback(!video.paused || 'Promise' in window && play instanceof Promise);
  },
  setVideoSrc: function(format, url) {
    var source;
    source = document.createElement('source');
    source.setAttribute('src', url);
    source.setAttribute('type', format);
    return source;
  },
  init: function() {
    return $(document).ready(function() {
      var videos;
      videos = $('*[data-video]');
      return CM.video.supportsVideoAutoplay(function(supported) {
        if (supported && Foundation.MediaQuery.atLeast('desktop')) {
          return videos.each(function() {
            var video, videoSrc;
            video = $(this);
            videoSrc = video[0];
            video.attr('muted', 'muted');
            video.attr('loop', 'loop');
            video.attr('playsinline', 'playsinline');
            if ((video.data('video-webm') != null) && video.data('video-webm') !== "") {
              video.append(CM.video.setVideoSrc('video/webm', video.data('video-webm')));
            }
            if ((video.data('video-mp4') != null) && video.data('video-mp4') !== "") {
              video.append(CM.video.setVideoSrc('video/mp4', video.data('video-mp4')));
            }
            video.addClass('a-bg-video--visibility-show');
            videoSrc.load();
            videoSrc.play();
            return CM.video.listen(videoSrc);
          });
        } else {
          return videos.remove();
        }
      });
    });
  },
  listen: (function(_this) {
    return function(videoSrc) {
      return $(document).on('visibilitychange', function() {
        return CM.video.update(videoSrc);
      });
    };
  })(this),
  update: function(videoSrc) {
    if (document.hidden && !videoSrc.paused) {
      return videoSrc.pause();
    } else if (!document.hidden && videoSrc.paused) {
      return videoSrc.play();
    }
  }
};

var RS;

RS = RS || {};

RS.global = {
  initialise: function() {
    var id;
    RS.global.foundation();
    RS.user.visited();
    if (RS.components.emailSignUp != null) {
      RS.emailSignUp.initialise();
    }
    if (RS.components.menu != null) {
      CM.menu.initialise();
    }
    if (RS.components.video != null) {
      CM.video.init();
    }
    id = document.getElementsByTagName('body')[0].id;
    switch (id) {
      case 'p-account-recovery-forgot-login':
      case 'p-account-recovery-pre-confirmation':
      case 'p-account-recovery-reset-password':
      case 'p-account-recovery-tracking-result':
      case 'p-account-recovery-reset-email-sent':
      case 'p-account-recovery-enter-login':
      case 'p-account-recovery-form-submitted':
        return CM.accountRecovery.initialise();
      case 'p-account-recovery-appeal-form':
        CM.accountRecovery.getRecoverFromGame();
        CM.accountRecovery.initialise();
        return CM.accountRecovery.manualInit();
      case 'p-account-recovery-identified':
        return CM.accountRecovery.accountIdentified();
      case 'p-account-recovery-recover-from-game':
        CM.accountRecovery.initialise();
        return CM.accountRecovery.setRecoverFromGame();
      case 'p-adventurers-log-settings':
        return CM.adventurersLog.settings();
      case 'p-create-account':
        return CM.accountCreation.initialise();
      case 'p-email-register-set-address':
      case 'p-email-register-change':
      case 'p-email-register-confirm-validated-email-address':
      case 'p-email-register-remove-login-email':
        return CM.emailRegister.initialise();
      case 'p-login':
        return CM.login.initialise();
      case 'p-logout':
        return CM.logout.initialise();
      case 'p-mfa':
        return CM.global.listenForm();
      case 'p-sn-noassociation':
        return RS.snNoassociation.initialise();
      case 'p-sn-setlogin':
        return RS.snSetLogin.initialise();
      case 'p-account-linked-accounts':
        return CM.account.linkedAccounts.initialise();
      case 'p-dob-submit':
        return CM.dob.initialise();
      case 'p-dob-submitted':
        CM.dob.initialise();
        return CM.dob.dobSubmitted();
      case 'p-password-history-password-change':
        return CM.global.listenForm();
      case 'p-premier-club':
        return RS.premierClub.initialise();
      case 'p-sn-upgrade':
        return CM.global.listenForm();
      case 'p-ticketing-view-dialogue':
        return CM.ticketing.dialogue();
      case 'p-ticketing-inbox':
        return CM.ticketing.inbox();
    }
  },
  foundation: function() {
    Foundation.Tabs.defaults.linkClass = 'c-tabs__option';
    Foundation.Tabs.defaults.panelClass = 'c-tabs__panel';
    Foundation.Tabs.defaults.deepLink = true;
    Foundation.Tabs.defaults.updateHistory = true;
    return $(document).foundation();
  }
};

RS.emailSignUp = {
  initialise: function() {
    return $(document).ready(function() {
      $('*[data-email-signup]').on('forminvalid.zf.abide', function() {
        return $(this).addClass('c-email-signup__form--style-attention');
      });
      return $('*[data-email-signup]').on('formvalid.zf.abide', function() {
        var cookieName, date, expires;
        cookieName = $(this).data("email-signup");
        date = new Date;
        date.setFullYear(date.getFullYear() + 10);
        expires = '; expires=' + date.toUTCString();
        return document.cookie = cookieName + "= 1" + expires + "; path=/";
      });
    });
  }
};

RS.premierClub = {
  initialise: function() {
    return $(document).ready((function(_this) {
      return function() {
        var $comparisonTable, $container, $featureRow, $window, fixedClass, haltedClass;
        $comparisonTable = $('*[data-js-comparison]');
        $container = $('*[data-js-comparison-container]');
        $featureRow = $('*[data-js-comparison-feature-row]');
        $window = $(window);
        fixedClass = 'c-comparison__row--fixed';
        haltedClass = 'c-comparison__row--halted';
        CM.premierClub.getPrices();
        return $window.on('load resize scroll', function() {
          var containerTopMargin, fixInitOffset, tableOffset, unfixAddition, windowScrollTop;
          windowScrollTop = $window.scrollTop();
          tableOffset = $comparisonTable.offset().top;
          containerTopMargin = parseInt($container.css('margin-top'));
          fixInitOffset = tableOffset - containerTopMargin;
          unfixAddition = $container.outerHeight() - $featureRow.height();
          if (windowScrollTop >= fixInitOffset && windowScrollTop <= fixInitOffset + unfixAddition) {
            $container.css('paddingTop', $featureRow.height() + 'px');
            $featureRow.removeClass(haltedClass);
            $featureRow.addClass(fixedClass);
            return $featureRow.css('width', $container.width() + 'px');
          } else if (windowScrollTop > fixInitOffset + unfixAddition) {
            $container.css('paddingTop', $featureRow.height() + 'px');
            $featureRow.removeClass(fixedClass);
            return $featureRow.addClass(haltedClass);
          } else {
            $container.css('paddingTop', '0');
            $featureRow.removeClass(haltedClass);
            $featureRow.removeClass(fixedClass);
            return $featureRow.css('width', 'auto');
          }
        });
      };
    })(this));
  }
};

RS.snNoassociation = {
  initialise: function() {
    return $('#syncAccount').on('click', function(ev) {
      ev.preventDefault();
      $('#landing-screen').remove();
      CM.global.listenForm();
      $('#l-vista').addClass('l-vista--size-narrow');
      $('#errorMessageForm').remove();
      return $('#associateAccount').addClass('sn-integration-sync--visibility-show');
    });
  }
};

RS.snSetLogin = {
  initialise: function() {
    return CM.global.listenForm();
  }
};

RS.user = {
  visited: function() {
    var expires;
    expires = 365;
    return Cookies.set('global__user-visited', true, {
      expires: expires,
      domain: 'runescape.com'
    });
  }
};

RS.global.initialise();
