src=open('music1_images.py').read().split("T = f'{OUT}/music-drummer'")[0]
exec(src)
import icons5
def build(outdir,name,kicker,title,slides,endt,ends,endb,art):
    global OUT
    OUT=f'/home/claude/social/out/{outdir}'
    T=f'{OUT}/{name}'; n=len(slides)+2
    art_cover(f'{T}-1.jpg',kicker,title,art,(160,130),total=n)
    sm=art.resize((260,int(260*art.height/art.width)))
    for i,(k,t,b) in enumerate(slides,start=2):
        slide(f'{T}-{i}.jpg',i,n,t,b,kicker=k,ghost=str(i-1)); add_art(f'{T}-{i}.jpg',sm,(W-340,H-300))
    end_slide(f'{T}-{n}.jpg',n,n,endt,ends,endb); add_art(f'{T}-{n}.jpg',sm,(W-340,980))
build('2026-10-20','grades-mastery','From my book The Future Ready Challenge','An A doesn’t prove mastery.',[
 ('Hot take','Often an A proves they figured out the test.','A student can learn how the test works without ever mastering what it tests.'),
 ('Think about it','Nobody hands you four answer choices.','Out in the real world, there is no multiple choice. You have to figure it out.'),
 ('So what counts?','Can they use it somewhere new?','Mastery is applying what you learned to a problem you have never seen before.'),
 ('Try this','Change the task, not just the grade.','Ask students to explain it, build with it, or argue a position. Then you can see what they know.'),
 ],'Agree or disagree?','Teachers and principals: tell me in the comments.','Save this • Share with a teacher',icons5.testsheet())
build('2026-10-23','piggyback-song','Before I was a principal, I was a musician','I played a kids’ song for one of my students. The room thought I was crazy.',[
 ('The setup','My mom is an educator who writes piggyback songs.','She takes a well-known tune and writes new lyrics over it to teach something. Twinkle Twinkle is also how we sing our ABCs.'),
 ('The gig','I was playing a show at a local restaurant.','Around 6 PM, a family came in with their kids. One of them was my student.'),
 ('The moment','He was so excited to see me.','I thought it was kind of cute. So for the next song, I played a piggyback song just for him.'),
 ('The result','He loved it. The audience thought I was crazy.','I would do it again. One happy kid beats a quiet room.'),
 ],'Meet kids where they are.','Teachers: what is the silliest thing you have done for a student? Tell me below.','Save this • Tag a teacher',icons5.guitar())
