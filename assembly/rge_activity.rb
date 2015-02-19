# Users by activity
p = Product.where(slug: 'really-good-emails').first
p.activities.where('created_at > ?', 3.months.ago).group(:actor_id).count.map{|k,v| [User.find(k).username, v]}.sort{|x,y| y[1] <=> x[1]}.map{|x| puts x.inspect};nil



