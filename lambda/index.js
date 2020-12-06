// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Insulin Wiserer! I help you calculate the amount of insulin you need to correct the blood sugar level down to your target value and to cover your carbohydrate intake.';

        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'corrFactorCaptureIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
    }
};

const corrFactorCaptureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'corrFactorCaptureIntent'
    },
    handle(handlerInput) {
        var yesOrNo = "";
        var corrFactorCapture = handlerInput.requestEnvelope.request.intent.slots.corrFactorCapture.value;
        if (corrFactorCapture === 'yes') {
            yesOrNo = "That's great!";
            const speakOutput = yesOrNo;
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'corrDoseCalcIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        else {
            const speakOutput = "I advise you to have your correction factor confirmed by your personal doctor as soon as possible. Without this entry, I cannot calculate the high blood sugar correction dose.";
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'eatChoIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
            
    }
};

const corrDoseCalcIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'corrDoseCalcIntent';
    },
    
    handle(handlerInput) {
        var corrDose = "";
        var actualVal = handlerInput.requestEnvelope.request.intent.slots.actualVal.value;
        var targetVal = handlerInput.requestEnvelope.request.intent.slots.targetVal.value;
        var corrFactor = handlerInput.requestEnvelope.request.intent.slots.corrFactor.value;
        
        if ((actualVal)&&(targetVal)) {
            if ((actualVal) > 150 && (actualVal) > (targetVal)) {
                corrDose = 'Ok, you will need '+ ((actualVal-targetVal)/corrFactor) + ' units of rapid acting insulin to get your target value.';   
            } 
            else {
                corrDose = 'Ok, you need no correction units of insulin.';
            }
        }
 
            const speechText = corrDose;

    return handlerInput.responseBuilder
      .addDelegateDirective({
          name : 'eatChoIntent'
      })
      .speak(speechText)
      //.reprompt(repromptText)
      .getResponse();
  }
};

const eatChoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'eatChoIntent';
    },
    handle(handlerInput) {
        var yesOrNo = "";
        var eatCho = handlerInput.requestEnvelope.request.intent.slots.eatCho.value;
        if (eatCho === 'yes') {
           yesOrNo =  'Ok, then you need more insulin for the carbohydrate coverage.';
           const speakOutput = yesOrNo;
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'choRatioCaptureIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        else {
            yesOrNo = "That's great! It is always highly recommended that people with diabetes minimize the amount of carbohydrate intake. You need no further carbohydrate coverage dose.";
            const speakOutput = yesOrNo;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        
            
    }
};

const choRatioCaptureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'choRatioCaptureIntent'
    },
    handle(handlerInput) {
        var yesOrNo = "";
        var choRatioCapture = handlerInput.requestEnvelope.request.intent.slots.choRatioCapture.value;
        if (choRatioCapture === 'yes') {
            yesOrNo = "Great!";
            const speakOutput = yesOrNo ;
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'choCoverageCalcIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        else {
            const speakOutput = "I advise you to have this ratio confirmed by your personal doctor. This will make your personal insulin calculation exact. For the moment, I'll take the norm values suggested by the diabetes center Nordschwarzwald in its intensive insulin therapy.";
        return handlerInput.responseBuilder
            .addDelegateDirective({
                name : 'choCoverageMealIntent'
            })
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
            
    }
};

const choCoverageCalcIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'choCoverageCalcIntent';
    },
    
    handle(handlerInput) {
        var choCoverage = "";
        var cho = handlerInput.requestEnvelope.request.intent.slots.cho.value;
        var choRatio = handlerInput.requestEnvelope.request.intent.slots.choRatio.value;
        
        if ((cho)&&(choRatio)) {
            choCoverage = 'To cover the amount of carbohydrate you need an additional '+ (cho/choRatio) + ' units of rapid acting insulin. I hope my calculation helped.';
        }
 
            const speechText = choCoverage;
        
    return handlerInput.responseBuilder
      .speak(speechText)
      //.reprompt(repromptText)
      .getResponse()
  }
};

const choCoverageMealIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'choCoverageMealIntent';
    },
    
    handle(handlerInput) {
        var choCoverageMeal = "";
        var meal = handlerInput.requestEnvelope.request.intent.slots.meal.value;
        var choMeal = handlerInput.requestEnvelope.request.intent.slots.choMeal.value;
        
        if (meal === "breakfast") {
            const choRatio = 5;
            choCoverageMeal = 'Alright, I’ll go with the norm carbohydrate:insulin ratio of 5 for breakfast. To cover the amount of carbohydrate you need an additional '+ (choMeal/choRatio) + ' units of rapid acting insulin. I hope my calculation helped.';
        } 
        else {
           if (meal === "lunch") {
               const choRatio = 10;
               choCoverageMeal = 'Alright, I’ll go with the norm carbohydrate:insulin ratio of 10 for lunch. To cover the amount of carbohydrate you need an additional '+ (choMeal/choRatio) + ' units of rapid acting insulin. I hope my calculation helped.';
           }
           else {
               const choRatio = 20/3;
               choCoverageMeal = 'Alright, I’ll go with the norm carbohydrate:insulin ratio of 20/3 for dinner. To cover the amount of carbohydrate you need an additional '+ (choMeal/choRatio) + ' units of rapid acting insulin. I hope my calculation helped.';
           }
        }
            const speechText = choCoverageMeal;
        
    return handlerInput.responseBuilder
      .speak(speechText)
      //.reprompt(repromptText)
      .getResponse()
  }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        corrFactorCaptureIntentHandler,
        corrDoseCalcIntentHandler,
        choRatioCaptureIntentHandler,
        eatChoIntentHandler,
        choCoverageCalcIntentHandler,
        choCoverageMealIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
