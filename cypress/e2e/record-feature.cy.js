describe("Record Feature", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.JRwuuoCYjuw737G2Pv3OnF8pLWkUG3xTSszrSkUv0dmX0naCTvD3Vop8IDa9NG46jPRigVPbtuEq0nYQxb6ZIMDON8Spv6cFEggeOd7mTnZkI1hioqcEz4YD-x__OxtvlZS5mUFFsQV1M5hQWEg1p6cxoBKIuKJMAuPfPFjn2VXwsUF0lTFPcBEewTNd1aop_hqo5iycEiLt38HMSITv-xv6nUcPdV0WdJVqhyRfbcOdzijEUe2GWO_w9bj1pP4xcAM3oG4-nZn7WVdBxjL-owwadyMnnkf-Q4HDMa_XP-4y4tWaVLkNzGPeGHQWdBbXK-YHVVkRXu_3aDpZwK3otZFZ6kArmk8paCQhsLAkRePORT3VdvqHXH_hFUGIFCQXdUAMjM4IoPE_vqV7-oHkR6x5qFoznctApwIDIvCG_MYHEXd-8a6OIMl02fwK_4Y9gpe49GPlYHwrKgSu5_LI-x4fePaR8M5eXeIzpiU6mtTbg4gzlY-sMIZeBGLcrvI8ST1-YIOJbcFDdO-0oZ0Gk8osiTRAlhfgCnQC3YzjaIx0Hsop3kZ5r_T5HjVznwxOcpwTVlHZib6JeqRjpdzMYa-3uP3UEJZyAPGTwKw8mZvzjyTDNKIkfnK_IW15d6969jJFamsVqWSr1C4QzSCtiQzcvLatn2kJNlalqOkjKkvnqzFXiSZiFagXp9XJcH09J4xpcBC3GUEqx1JVHONwU3AL5XFSv40ivl_w-crV70rflChTNaHuhTG4IjxlGR6kTDaeq8e12wEIS2tPPntbiWQEeyDf1tWcFXu0YCJYFoDgWKAT7uynBCh8VrMx_5uLFnLQ0tDoJaAO8szfTi8rcIxjX2FZd45ocDVvg_oLMl0Ckow7sXe78hkKsCDTK3CSKhSYpuIyEltK2FbU2Dby5cYvuOSsW27jSrTdXiAUdxyY44IgxnJLUqwub42JFAmGBRDoBdhXOBUF_RNjExw7c46hnGA9IKErLvy5jd56q_s.MFSjPLHEH2zGlPd0U98Flg.6700a728c8fcc37ff96368207e99a895d5402b77de5c82ef254cc099d91ab4f3";

  beforeEach(() => {
    // cy.login() uses cy.session() internally.
    cy.login(email, password, captcha);
  });

  it("Should navigate to homepage after successful login", () => {
    // After session is restored, directly go to the homepage.
    cy.visit("https://app-v4.btwazure.com/", { timeout: 30000 });

    // Verify the URL is correct
    cy.url().should("eq", "https://app-v4.btwazure.com/");
  });
});
