import Channel from "../lib/Channel";
import { expect, sinon, TestUtils } from "./NexmoTestUtils";

//
describe("Channel", function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
    this.httpClientStub = TestUtils.getHttpClient();
    this.sandbox.stub(this.httpClientStub, "request");
    this.channel = new Channel(TestUtils.getCredentials(), {
      api: this.httpClientStub
    });
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe("send", function() {
    it("should call the correct endpoint", function() {
      return expect(this.channel)
        .method("send")
        .withParams(
          { type: "sms", number: "1234567890" },
          { type: "sms", number: "9876543210" },
          { type: "text", text: "Hello World" }
        )
        .to.post.to.url(Channel.PATH);
    });

    it("formats the outgoing request correctly (message only)", function(done) {
      const to = { type: "sms", number: "1234567890" };
      const from = { type: "sms", number: "9876543210" };
      const content = { type: "text", text: "Hello World" };

      const postMock = this.sandbox.mock(this.httpClientStub);
      postMock
        .expects("post")
        .once()
        .withArgs(Channel.PATH, {
          from: from,
          to: to,
          message: {
            content: content
          }
        })
        .yields(null, []);

      this.channel.send(to, from, content, () => {
        postMock.verify();
        done();
      });
    });

    it("formats the outgoing request correctly (additional data only)", function(done) {
      const to = { type: "sms", number: "1234567890" };
      const from = { type: "sms", number: "9876543210" };
      const content = { type: "text", text: "Hello World" };

      const postMock = this.sandbox.mock(this.httpClientStub);
      postMock
        .expects("post")
        .once()
        .withArgs(Channel.PATH, {
          from: from,
          to: to,
          message: {
            content: content,
            viber_ttl: 3600
          }
        })
        .yields(null, []);

      this.channel.send(to, from, content, { viber_ttl: 3600 }, () => {
        postMock.verify();
        done();
      });
    });
  });
});
