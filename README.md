##Code Test Submission
Submission includes web form, queue, and consumer which emails form data. It uses direct exchange and only uses one connection, one exchange, one channel, and one queue. Emails are preset to be sent to dscodetest@mailinator.com.

App uses a hosted RabbitMQ instance with CloudAMQP and is hosted on Heroku [here] (https://aqueous-eyrie-86376.herokuapp.com/).


#Considerations
For security, data can be validated on form submission. Also data being sent to CloudAMQP could be encrypted.
