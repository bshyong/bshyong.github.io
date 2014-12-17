require 'json'

namespace :metrics do
  task :comment_histogram => :environment do
    data = []
    Product.find_each do |product|
      next if product.comment_responsiveness < 1
      data << {
        "product" => product.slug,
        "cr" => product.comment_responsiveness
      }
    end
    File.open("comment_histogram.json","w") do |f|
      f.write(data.to_json)
    end
  end
  task :comment_bullets => :environment do
    data = []
    avg = ProductMetric.average
    stddev = ProductMetric.stddev

    Product.find_each do |product|
      next if product.comment_responsiveness < 1
      data << {
        "title" => product.slug,
        "subtitle" => "core: #{product.core_team.count}",
        "ranges" => [1.day, 3.days, 5.days, 7.days, 14.days].map(&:to_i),
        "measures" => [product.comment_responsiveness],
        "markers" => [avg],
        "comment_count" => Event::Comment.where(wip_id: product.wips.map(&:id)).count
      }
    end
    File.open("comment_bullets.json","w") do |f|
      f.write(data.to_json)
    end
  end
end


