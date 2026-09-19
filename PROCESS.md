# Process

A good university course, from my perspective, should connect closely to the
society that students will eventually enter. Many university courses focus on
hard technical knowledge, such as programming. That knowledge is important,
but it does not necessarily help students understand how organisations and
workplaces operate, or why technology alone cannot solve every problem. I
therefore narrowed my original idea about general workplace “unwritten rules”
to a more specific question: what actually determines the conclusion of a
meeting, and how much of that decision is made before the formal meeting begins?
*The Meeting Before the Meeting* uses invitations, agendas, private
conversations and written records to make that hidden process visible.

My main concern with the Alignment Lab was that role-play could become
superficial. If students were only given personality labels, they could perform
a character without experiencing any meaningful pressure or making a difficult
decision. I therefore preferred roles defined through different
responsibilities, information, baselines, dependencies and minimum acceptable
outcomes. Students make decisions with incomplete information rather than
simply imitating a personality. They also leave an initial judgement, strategy
memo, negotiation log and decision record, making it possible to see why and
when their position changed. The assessment consequently focuses on how they
use evidence and limited opportunities, rather than how persuasive, confident
or theatrical they appear.

I treated objective, repeatable promises as the right things to automate. The
course must cover all twelve teaching weeks, assessment weights must total
100%, and every role must contain the same required fields. These promises
appear across multiple pages and can be judged consistently, so the checks
introduced in [`5ade0a8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/5ade0a806babdb5dc8b48505ae8c10e2374858a4)
provide faster and more reliable feedback than repeatedly reading the whole
website for missing fields or arithmetic drift.

Some factors should be left to human judgement, say, the coherence of twelve 
weeks content, the setting of different info, character, and dependencies can
indeed make one's choice, and the weight of assessment.

When I inspected the first substantial version, I thought the website framework
was sound, but I did not accept the content as complete because it only reached
Week 3. That early slice is visible in
[`7433cd3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/7433cd39021bccb5f073d9a96b44df904613bd9e),
while the later twelve-week implementation is recorded in
[`de71113`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/de71113a11a7e91495b84ba11e0a4a3c1444eafb).

Completing the twelve weeks did not mean the content agreed with itself. 
Going back through the site afterwards, I found specific claims that had drifted 
from the canonical case data: the Finance & Risk memo had been overstated into 
"signs off the budget" when the source only supports it recording the figure and 
carrying a signature, the Alignment Lab's pathway scoring model disagreed with 
the decision record it fed, and Week 3's "real agenda item" line risked being 
misread as the fictional case rather than the student's own exercise. I fixed 
each of these and added a corresponding test with a negative example, so a 
future edit that reintroduces the same overclaim fails the build rather than 
sitting unnoticed (5af0879, bec2d04, 05e8188).
