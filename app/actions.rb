helpers do
  def current_user
    @current_user = User.find(session[:id]) if session[:id]
  end

  def page_number
    @page_number = params[:page_number] || 1
  end

  def all_bets
    @bets = Bet.all
  end

  def bet_for_a_user_on_a_promise(user_id, promise_id)
    @bet_for_a_user_on_a_promise = Bet.where("user_id = ? AND promise_id = ?", user_id, promise_id).take(1)[0]
  end

  def total_users_for_the_promise_to_be_kept(promise_id)
    @total_users_for_the_promise_to_be_kept = Bet.where("promise_id = ? AND in_favour = true", promise_id).count
  end

  def total_users_against_the_promise_to_be_kept(promise_id)
    @total_users_against_the_promise_to_be_kept = Bet.where("promise_id = ? AND in_favour = false", promise_id).count
  end

  def check_flash
    if session[:flash_error]
      @flash_error = session[:flash_error]
      session[:flash_error] = nil
    elsif session[:flash_success]
      @flash_success = session[:flash_success]
      session[:flash_success] = nil
    end
  end 

  def friend_since(friend_id, user_id)
    Friendship.find_by(user_id: user_id, friend_id: friend_id).created_at.to_date
  end

end

before do
  current_user
  all_bets
  check_flash
  Promise.check_expired
end

get '/' do
  erb :index
end

get '/promises' do
  @promises = Promise.all.reorder("expires_at").paginate(:page => page_number, :per_page => 20)
  erb :'promises/index'
end

get '/all/promises' do
  content_type :json
  @users = User.all
  @promises = Promise.all.reorder("expires_at").paginate(:page => page_number, :per_page => 20)
  [@users, @promises].to_json
end

get '/friends/promises' do
  content_type :json
  @friends = @current_user.friends
  @promises = Promise.all.where(:user_id => @friends.select("id")).reorder("expires_at").paginate(:page => page_number, :per_page => 20)
  [@friends, @promises].to_json
end

get '/promises/new' do
  @promise = Promise.new
  erb :'promises/new'
end

get '/promises/:id' do |id|
  @promise = Promise.find(id)
  total_users_for_the_promise_to_be_kept(id)
  total_users_against_the_promise_to_be_kept(id)
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  erb :'promises/show'
end

post '/promises/new' do
  promise = Promise.new(
    content: params[:content],
    expires_at: params[:expires_at],
    user_id: @current_user.id
  )
  if promise.save
    session[:flash] = 'Promise created'
    redirect "/promises/#{promise.id}"
  else
    session[:flash] = 'There was a problem'
    redirect 'promises/new'
  end
end

post '/promises/:id/new_bet' do |id|
  @promise = Promise.find(id)
  total_users_for_the_promise_to_be_kept(id)
  bet_in_favour = true if params[:in_favour] =~ /Yes/
  bet_in_favour = false if params[:not_in_favour] =~ /No/
  @bet = Bet.new(
    bet_value: params[:bet_value],
    in_favour: bet_in_favour,
    user_id: @current_user.id,
    promise_id: id
  )
  @bet.save
  @current_user_bet = bet_for_a_user_on_a_promise(@current_user.id, id)
  redirect "/promises/#{id}"
end

post '/promises/:id/validate' do |id|
  @promise = Promise.find(id)
  validation = true if params[:yes] == "Promise Kept"
  validation = false if params[:no] == "Promise Not Kept"
  @promise.update(validated: validation, expires_at: DateTime.now - 8.hours)
  @promise.apply_promise_value
  @promise.bets.each { |bet| bet.apply_bet }
  redirect "/promises/#{id}"
end

get '/profile' do
  if @current_user
    @user = @current_user
    erb :'users/show'
  else
    redirect :'/'
  end
end

get '/users' do
  @users =  User.all.paginate(:page => page_number, :per_page => 20)
  erb :'users/index'
end

get '/users/:id' do
  @user = User.find(params[:id])
  erb :'users/show'
end

post '/promises/:id/comment/new' do |id|
  promise = Promise.find(id)
  user = @current_user
  comment = Comment.new(
    body: params[:body],
    user_id: user.id,
    promise_id: promise.id
  )

  user.comments << comment
  promise.comments << comment 

  redirect "/promises/#{id}"

end

post '/users/friends/new/:id' do |id|
  Friendship.new(user_id: current_user.id, friend_id: id)
  current_user.friends << User.find(id)
  session[:flash_success] = "Added #{User.find(id).name} to friends!"
  redirect "/users/#{id}"
end

post '/login' do
  user = User.find_by(email: params[:email])
  if user && user.authenticate(params[:password])
    session[:id] = user.id
    redirect "/users/#{user.id}"
  else
    session[:flash_error] = "Invalid login."
    redirect '/'
  end
end

get '/logout' do
  session[:id] = nil
  redirect "/"
end

get '/signup' do
  @user = User.new
  erb :'users/new'
end

post '/signup' do
  @user = User.new(
    first_name: params[:first_name],
    last_name: params[:last_name],
    email: params[:email],
    password: '',
    password_confirmation: 'nomatch'
  )
  @user.password = params[:password]
  @user.password_confirmation = params[:pass_conf]

  if @user.save
    session[:id] = @user.id
    redirect "/users/#{@user.id}"
  else
    session[:flash_error] = "Signup Failed"
    redirect '/signup'
  end
end

get '/admin/:id' do |id|
  session[:id] = nil
  @user = User.find(id)
  session[:id] = id
  redirect '/'
end