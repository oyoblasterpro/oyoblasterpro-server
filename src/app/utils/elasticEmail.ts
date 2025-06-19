import { configs } from "../configs";

const ElasticEmail = require('@elasticemail/elasticemail-client');

const defaultClient = ElasticEmail.ApiClient.instance;

const apikey = defaultClient.authentications['apikey'];
apikey.apiKey = configs.el_api_key!

const api = new ElasticEmail.EmailsApi()


const sendElasticEmail = (email: string, subject: string, html: string) => {
    const payload = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient(email)
        ],
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                    ContentType: "HTML",
                    Content: html
                })
            ],
            Subject: subject,
            From: "info@digitalcreditai.com"
        }
    });

    const callback = function (error: any, data: any, response: any) {
        if (error) {
            console.error(error);
        } else {
            // console.log('API called successfully.');
        }
    };
    api.emailsPost(payload, callback);

}

export default sendElasticEmail